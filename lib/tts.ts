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

  // Use eleven_turbo_v2_5 model which supports up to 40,000 chars per request
  // This is much higher than the older models (5000 chars)
  const MAX_CHARS = 40000;

  // If text fits in single request, generate directly
  if (text.length <= MAX_CHARS) {
    console.log(`[TTS] Generating audio for ${text.length} characters in single request`);
    return await generateChunk(text, elevenLabsVoiceId);
  }

  // For very long text (>40k chars), truncate at sentence boundary
  // This handles edge cases like entire books
  console.log(`[TTS] Text very long (${text.length} chars), truncating to ${MAX_CHARS} chars at sentence boundary`);

  const truncated = text.substring(0, MAX_CHARS);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

  const textToGenerate = lastSentenceEnd > 0
    ? text.substring(0, lastSentenceEnd + 1)
    : truncated;

  console.log(`[TTS] Truncated at sentence boundary: ${textToGenerate.length} chars`);
  return await generateChunk(textToGenerate, elevenLabsVoiceId);
}

// Generate audio for a single text chunk
async function generateChunk(text: string, elevenLabsVoiceId: string): Promise<ArrayBuffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', // Supports up to 40,000 chars (vs 5,000 for v1)
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

