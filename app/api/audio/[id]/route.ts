import { NextRequest, NextResponse } from 'next/server';

// Store generated audio in memory temporarily
// In production, this would use a database or cloud storage
const audioCache = new Map<string, ArrayBuffer>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Get audio from cache
  const audioBuffer = audioCache.get(id);

  if (!audioBuffer) {
    return NextResponse.json(
      { error: 'Audio not found' },
      { status: 404 }
    );
  }

  // Return as proper audio/mpeg response (not data URL)
  return new NextResponse(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

// Export cache for use in generate route
export { audioCache };
