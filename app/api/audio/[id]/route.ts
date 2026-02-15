import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Audio streaming endpoint removed — serverless functions are stateless,
  // so in-memory cache doesn't persist between requests.
  // Audio is now returned as data URLs directly from the generate endpoint.
  return NextResponse.json(
    { error: 'Audio not found. Audio is now embedded directly in generation responses.' },
    { status: 410 }
  );
}
