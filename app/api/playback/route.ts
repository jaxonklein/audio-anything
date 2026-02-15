import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { savePlaybackPosition, getPlaybackPosition } from '@/lib/db';

/**
 * GET /api/playback?audioItemId=xxx
 * Get playback position for an audio item
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const audioItemId = searchParams.get('audioItemId');

    if (!audioItemId) {
      return NextResponse.json(
        { error: 'audioItemId is required' },
        { status: 400 }
      );
    }

    const position = await getPlaybackPosition(userId, audioItemId);

    return NextResponse.json({ position });
  } catch (error) {
    console.error('Get playback position error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/playback
 * Save playback position for an audio item
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { audioItemId, position } = await request.json();

    if (!audioItemId || position === undefined) {
      return NextResponse.json(
        { error: 'audioItemId and position are required' },
        { status: 400 }
      );
    }

    await savePlaybackPosition(userId, audioItemId, position);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save playback position error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
