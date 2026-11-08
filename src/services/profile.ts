import { supabase } from '../supabaseClient';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchProfileById(userId: string | null | undefined): Promise<UserProfile | null> {
  if (!userId || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as UserProfile | null;
}

export async function updateProfile(updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'bio' | 'location'>>) {
  if (!supabase) {
    throw new Error('Supabase chưa được cấu hình.');
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('Phiên đăng nhập không hợp lệ.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as UserProfile;
}

export async function fetchUserStats(userId: string | null | undefined) {
  if (!userId || !supabase) {
    return { followers: 0, following: 0 };
  }

  const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
    supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
  ]);

  return {
    followers: followersCount ?? 0,
    following: followingCount ?? 0,
  };
}

export async function fetchFavoritePlaces(userId: string | null | undefined) {
  if (!userId || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
