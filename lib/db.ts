import { supabase } from './supabase';

// User management
export async function createUser(email: string, oauthProvider: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

// Audio item management
export async function createAudioItem(
  userId: string,
  title: string,
  sourceUrl: string | null,
  sourceText: string | null,
  wordCount: number
) {
  const { data, error } = await supabase
    .from('audio_items')
    .insert([{
      user_id: userId,
      title,
      source_url: sourceUrl,
      source_text: sourceText,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAudioItem(
  id: string,
  updates: {
    audio_url?: string;
    duration?: number;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
  }
) {
  const { data, error } = await supabase
    .from('audio_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserAudioItems(userId: string, limit = 100) {
  const { data, error } = await supabase
    .from('audio_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function deleteAudioItem(id: string, userId: string) {
  const { error } = await supabase
    .from('audio_items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// Playback position management
export async function savePlaybackPosition(
  userId: string,
  audioItemId: string,
  position: number
) {
  const { data, error} = await supabase
    .from('playback_positions')
    .upsert({
      user_id: userId,
      audio_item_id: audioItemId,
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPlaybackPosition(userId: string, audioItemId: string) {
  const { data, error } = await supabase
    .from('playback_positions')
    .select('position')
    .eq('user_id', userId)
    .eq('audio_item_id', audioItemId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.position || 0;
}

// Rate limiting (for logged-in users - anonymous still uses cookies)
export async function getUserGenerationCount(userId: string, since: Date) {
  const { data, error } = await supabase
    .from('audio_items')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString());

  if (error) throw error;
  return data.length;
}
