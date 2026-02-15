const VOICES = {
  'male1': 'pNInz6obpgDQGcFmaJgB', // Adam - Warm, professional
  'male2': 'TxGEqnHWrfWFTfGW9XjX', // Josh - Clear, authoritative
  'female1': '21m00Tcm4TlvDq8ikWAM', // Rachel - Friendly, engaging
  'female2': 'EXAVITQu4vr4xnSDxMaL', // Bella - Clear, narrative
};

export async function generateAudio(text: string, voiceId: string = 'male1'): Promise<ArrayBuffer> {
  if (!text) {
    throw new Error('Text is required for audio generation');
  }

  // Map friendly voice ID to ElevenLabs voice ID
  const elevenLabsVoiceId = VOICES[voiceId as keyof typeof VOICES] || VOICES.male1;

  // Check if API key is configured
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  // Truncate text to ElevenLabs character limit (5000 chars max)
  // This ensures the audio isn't truncated mid-word
  const MAX_CHARS = 5000;
  const truncatedText = text.length > MAX_CHARS ? text.substring(0, MAX_CHARS) : text;

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
        text: truncatedText,
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
    throw new Error(`TTS generation failed: ${error}`);
  }

  return await response.arrayBuffer();
}
