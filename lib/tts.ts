const VOICES = {
  'male1': 'pNInz6obpgDQGcFmaJgB', // Adam - Warm, professional
  'male2': 'TxGEqnHWrfWFTfGW9XjX', // Josh - Clear, authoritative
  'female1': '21m00Tcm4TlvDq8ikWAM', // Rachel - Friendly, engaging
  'female2': 'EXAVITQu4vr4xnSDxMaL', // Bella - Clear, narrative
};

// ElevenLabs has a character limit per request (~5000 chars for production tier)
// Split text into chunks to handle long articles
const MAX_CHUNK_LENGTH = 4000; // Conservative limit to avoid API errors

function chunkText(text: string): string[] {
  // If text is short enough, return as single chunk
  if (text.length <= MAX_CHUNK_LENGTH) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/); // Split on sentence boundaries
  let currentChunk = '';

  for (const sentence of sentences) {
    // If adding this sentence would exceed the limit, save current chunk and start new one
    if (currentChunk.length + sentence.length > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  // Add the last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function generateSingleChunk(text: string, voiceId: string): Promise<ArrayBuffer> {
  const elevenLabsVoiceId = VOICES[voiceId as keyof typeof VOICES] || VOICES.male1;

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

function concatenateAudioBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  // Calculate total length
  const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0);

  // Create new buffer and concatenate
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return result.buffer;
}

export async function generateAudio(text: string, voiceId: string = 'male1'): Promise<ArrayBuffer> {
  if (!text) {
    throw new Error('Text is required for audio generation');
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  // Split text into chunks
  const chunks = chunkText(text);
  console.log(`[TTS] Generating audio for ${chunks.length} chunk(s), total ${text.length} characters`);

  // Generate audio for each chunk
  const audioBuffers: ArrayBuffer[] = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`[TTS] Processing chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);
    const buffer = await generateSingleChunk(chunks[i], voiceId);
    audioBuffers.push(buffer);
  }

  // If only one chunk, return it directly
  if (audioBuffers.length === 1) {
    return audioBuffers[0];
  }

  // Concatenate all audio buffers
  console.log(`[TTS] Concatenating ${audioBuffers.length} audio chunks`);
  return concatenateAudioBuffers(audioBuffers);
}
