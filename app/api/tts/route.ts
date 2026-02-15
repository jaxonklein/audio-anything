import { NextRequest, NextResponse } from 'next/server';
import { generateAudio } from '@/lib/tts';

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId = 'male1' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Generate audio using shared TTS function
    const audioBuffer = await generateAudio(text, voiceId);

    // TODO: Upload to Supabase Storage and return permanent URL
    // For now, return audio directly (works but not persistent)
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
