import { NextRequest, NextResponse } from 'next/server';

const VOICES = {
  'male1': 'pNInz6obpgDQGcFmaJgB', // Adam - Warm, professional
  'male2': 'TxGEqnHWrfWFTfGW9XjX', // Josh - Clear, authoritative
  'female1': '21m00Tcm4TlvDq8ikWAM', // Rachel - Friendly, engaging
  'female2': 'EXAVITQu4vr4xnSDxMaL', // Bella - Clear, narrative
};

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId = 'male1' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Map friendly voice ID to ElevenLabs voice ID
    const elevenLabsVoiceId = VOICES[voiceId as keyof typeof VOICES] || VOICES.male1;

    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn('ElevenLabs API key not configured, using stub audio');
      // Return stub audio URL for development
      return NextResponse.json({
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        isStub: true,
      });
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return NextResponse.json(
        { error: 'TTS generation failed', details: error },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

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
