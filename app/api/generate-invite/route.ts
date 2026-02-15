import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'BETA-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user already generated an invite
    const { data: existing } = await supabase
      .from('beta_invites')
      .select('*')
      .eq('created_by_user_id', userId)
      .single();

    if (existing) {
      return NextResponse.json({
        code: existing.code,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}?invite=${existing.code}`
      });
    }

    // Generate new invite code
    const code = generateInviteCode();

    const { error } = await supabase
      .from('beta_invites')
      .insert([{
        code,
        created_by_user_id: userId,
        max_uses: 1,
        uses: 0,
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;

    return NextResponse.json({
      code,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}?invite=${code}`
    });
  } catch (error) {
    console.error('Invite generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invite' },
      { status: 500 }
    );
  }
}
