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

  // ElevenLabs character limit: 5000 chars max per request
  const MAX_CHARS = 5000;

  // If text is short enough, generate directly
  if (text.length <= MAX_CHARS) {
    return await generateChunk(text, elevenLabsVoiceId);
  }

  // For long text, split into chunks and concatenate audio
  const chunks = splitTextIntoChunks(text, MAX_CHARS);
  console.log(`[TTS] Generating ${chunks.length} audio chunks for ${text.length} characters`);

  const audioBuffers: ArrayBuffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`[TTS] Generating chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);
    const chunkBuffer = await generateChunk(chunks[i], elevenLabsVoiceId);
    audioBuffers.push(chunkBuffer);
  }

  // Concatenate all audio buffers into single MP3
  return concatenateAudioBuffers(audioBuffers);
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

// Split text into chunks at natural boundaries (sentences/paragraphs)
function splitTextIntoChunks(text: string, maxChars: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  // Split by paragraphs first (double newlines)
  const paragraphs = text.split(/\n\n+/);

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed limit, save current chunk and start new one
    if (currentChunk.length + paragraph.length + 2 > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }

    // If a single paragraph is too long, split by sentences
    if (paragraph.length > maxChars) {
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxChars && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        currentChunk += sentence;
      }
    } else {
      // Add paragraph to current chunk
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  // Add final chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Concatenate multiple MP3 audio buffers into a single buffer
function concatenateAudioBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  // Calculate total size
  const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0);

  // Create new buffer to hold concatenated audio
  const result = new Uint8Array(totalLength);

  // Copy each buffer into result
  let offset = 0;
  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return result.buffer;
}
