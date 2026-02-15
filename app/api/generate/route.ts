import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit, incrementRateLimit } from '@/lib/rate-limit';
import { checkPremiumStatus, getFeatureLimits } from '@/lib/premium';
import { createAudioItem, updateAudioItem } from '@/lib/db';
import { trackEvent } from '@/lib/posthog-server';
import { generateAudio } from '@/lib/tts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { url, text, voice } = await request.json();

    // Get user authentication status
    const { userId } = await auth();

    // Check if user has premium subscription
    const premiumStatus = userId ? await checkPremiumStatus(userId) : { isPremium: false };
    const isPremium = premiumStatus.isPremium;
    const limits = getFeatureLimits(isPremium);

    // Check rate limits
    const rateLimit = await checkRateLimit(userId, isPremium);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: isPremium
            ? `Monthly limit reached (${rateLimit.limit} generations). Resets ${rateLimit.resetAt.toLocaleDateString()}.`
            : `Hourly limit reached (${rateLimit.limit} generations). Try again in ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes or upgrade to Premium.`,
          errorType: 'rate_limit',
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt.toISOString(),
          limit: rateLimit.limit
        },
        { status: 429 }
      );
    }

    // Validate input
    if (!url && !text) {
      return NextResponse.json(
        { error: 'Either URL or text is required' },
        { status: 400 }
      );
    }

    let articleText = text;
    let title = '';
    let wordCount = 0;

    // Extract article content from URL if provided
    if (url) {
      // Validate URL and check for unsupported types
      const urlLower = url.toLowerCase();

      // Check for video URLs (YouTube, Vimeo, etc.)
      if (
        urlLower.includes('youtube.com') ||
        urlLower.includes('youtu.be') ||
        urlLower.includes('vimeo.com') ||
        urlLower.includes('dailymotion.com') ||
        urlLower.includes('twitch.tv')
      ) {
        return NextResponse.json(
          {
            error: 'Video URLs not supported. Try an article, blog post, or PDF.',
            errorType: 'video',
          },
          { status: 400 }
        );
      }

      // Check for social media URLs
      if (
        urlLower.includes('twitter.com') ||
        urlLower.includes('x.com') ||
        urlLower.includes('reddit.com') ||
        urlLower.includes('facebook.com') ||
        urlLower.includes('instagram.com') ||
        urlLower.includes('linkedin.com/posts') ||
        urlLower.includes('tiktok.com')
      ) {
        return NextResponse.json(
          {
            error: 'Social media and forum URLs not supported. Try an article or blog post.',
            errorType: 'social',
          },
          { status: 400 }
        );
      }

      try {
        // Fetch the webpage
        const fetchResponse = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AudioAnything/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          signal: AbortSignal.timeout(15000),
        });

        if (!fetchResponse.ok) {
          return NextResponse.json(
            { error: `Unable to fetch URL (HTTP ${fetchResponse.status}). The page may be paywalled or unavailable.`, errorType: 'extraction' },
            { status: 400 }
          );
        }

        const html = await fetchResponse.text();

        // Use Claude to extract the article text
        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 8192,
          messages: [{
            role: 'user',
            content: `Extract the main article text from this HTML. Return ONLY the article content as plain text — no HTML, no markdown, no commentary. Include the title as the first line. If there is no extractable article content, respond with exactly "NO_ARTICLE_FOUND".

<html>
${html.slice(0, 100000)}
</html>`
          }],
        });

        const extracted = (message.content[0] as { type: string; text: string }).text;

        if (extracted.trim() === 'NO_ARTICLE_FOUND') {
          return NextResponse.json(
            { error: 'Could not find article content at this URL. Try a different article, blog post, or documentation page.', errorType: 'extraction' },
            { status: 400 }
          );
        }

        // Split title from body (first line is title)
        const lines = extracted.split('\n');
        title = lines[0].trim();
        articleText = lines.slice(1).join('\n').trim();
        if (!articleText) articleText = extracted;
      } catch (error: any) {
        if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
          return NextResponse.json(
            { error: 'The page took too long to load. Try a different URL.', errorType: 'extraction' },
            { status: 400 }
          );
        }
        console.error('Content extraction failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        return NextResponse.json(
          { error: 'Unable to extract article text. This content may be paywalled or protected.', details: error?.message },
          { status: 400 }
        );
      }
    }

    // Count words
    wordCount = articleText.trim().split(/\s+/).length;

    // Check word count limits based on user tier
    if (wordCount > limits.maxWordCount) {
      return NextResponse.json(
        {
          error: isPremium
            ? `Article too long (${wordCount.toLocaleString()} words). Premium tier supports up to ${limits.maxWordCount.toLocaleString()} words.`
            : `Article too long (${wordCount.toLocaleString()} words). Free tier supports up to ${limits.maxWordCount.toLocaleString()} words. Upgrade to Premium for articles up to 25,000 words.`,
          errorType: 'word_limit',
          wordCount,
          limit: limits.maxWordCount
        },
        { status: 400 }
      );
    }

    // TODO: Check rate limits (3/hour for free, 200/month for premium)

    // Generate audio with ElevenLabs TTS
    const voiceId = voice || 'male1';

    try {
      // Generate audio using shared TTS function
      const audioBuffer = await generateAudio(articleText, voiceId);

      // Convert to data URL (in production, upload to cloud storage)
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

      // Increment rate limit counter after successful generation
      const rateLimitCookie = await incrementRateLimit(userId, isPremium);

      // Calculate expiration based on tier
      const expiresAt = limits.linkExpiration
        ? new Date(Date.now() + limits.linkExpiration)
        : null; // Premium users: no expiration

      // Save to database if user is authenticated
      let audioItemId = `audio_${Date.now()}`;
      if (userId) {
        try {
          const audioItem = await createAudioItem(
            userId,
            title || "Article Audio",
            url || null,
            url ? null : articleText, // Only store text if no URL
            wordCount
          );

          // Update with audio URL after generation
          await updateAudioItem(audioItem.id, {
            audio_url: audioDataUrl,
            duration: Math.ceil(wordCount / 200) * 60, // estimated seconds
            status: 'completed'
          });

          audioItemId = audioItem.id;
        } catch (dbError) {
          console.error('Failed to save audio to database:', dbError);
          // Continue anyway - don't block audio generation on DB errors
        }
      }

      // Calculate updated rate limit from the new cookie value
      // This ensures we return the correct remaining count immediately
      let updatedRateLimit;
      if (!userId && !isPremium && rateLimitCookie) {
        // Parse the cookie to get accurate count
        const timestamps = JSON.parse(rateLimitCookie);
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        const recentTimestamps = timestamps.filter((t: number) => t > oneHourAgo);
        const limit = 3;
        const remaining = Math.max(0, limit - recentTimestamps.length);
        const oldestTimestamp = recentTimestamps.length > 0 ? Math.min(...recentTimestamps) : now;
        updatedRateLimit = {
          remaining,
          limit,
          resetAt: new Date(oldestTimestamp + 60 * 60 * 1000),
          allowed: recentTimestamps.length < limit
        };
        console.log(`[Generate API] Calculated rate limit from cookie: remaining=${remaining}, count=${recentTimestamps.length}, limit=${limit}`);
      } else {
        // For authenticated users, check normally
        updatedRateLimit = await checkRateLimit(userId, isPremium);
        console.log(`[Generate API] Rate limit from checkRateLimit: remaining=${updatedRateLimit.remaining}`);
      }

      // Track audio generation event
      await trackEvent(
        userId || request.headers.get('x-forwarded-for') || 'anonymous',
        'audio_generated',
        {
          wordCount,
          isPremium,
          hasUrl: !!url,
          voiceId,
          source: url ? 'url' : 'text',
        }
      );

      const response = NextResponse.json({
        success: true,
        id: audioItemId,
        title: title || "Article Audio",
        text: articleText,
        wordCount,
        estimatedDuration: Math.ceil(wordCount / 200), // ~200 words per minute
        audioUrl: audioDataUrl,
        sourceUrl: url,
        voiceId: voiceId,
        generatedAt: new Date().toISOString(),
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
        isPremium,
        rateLimit: {
          remaining: updatedRateLimit.remaining,
          resetAt: updatedRateLimit.resetAt.toISOString(),
          limit: updatedRateLimit.limit
        }
      });

      // Set rate limit cookie for anonymous users
      if (rateLimitCookie) {
        response.cookies.set('generations', rateLimitCookie, {
          maxAge: 60 * 60, // 1 hour
          path: '/',
          sameSite: 'lax'
        });
      }

      return response;
    } catch (ttsError) {
      console.error('TTS generation error:', ttsError);
      return NextResponse.json(
        { error: 'Failed to generate audio', errorType: 'tts_failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
