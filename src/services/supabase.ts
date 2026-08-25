import { createClient, SupabaseClient, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { Post, User } from '../types';
import { INITIAL_POSTS } from './seedData';
import { getRandomAvatarColor } from './storage';
export { supabase } from '../supabase';

// Supabase Environment variables
const RAW_ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://klkcebognzimoxyptjbf.supabase.co';
const ENV_SUPABASE_URL = RAW_ENV_SUPABASE_URL.trim().replace(/\/+$/, '');
const ENV_SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_IRek43f4NrXZ0uxKfUlfMQ_4PmXyora').trim();

// Local storage override keys for dynamic connection testing
const STORAGE_KEYS = {
  SUPABASE_URL: 'doodleboard_supabase_url',
  SUPABASE_ANON_KEY: 'doodleboard_supabase_anon_key',
};

export const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
  const customKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY);

  const rawUrl = (customUrl && customUrl.trim()) || ENV_SUPABASE_URL;
  // Always strip trailing slashes and extraneous whitespace
  const url = rawUrl.trim().replace(/\/+$/, '');
  const anonKey = (customKey && customKey.trim()) || ENV_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url && 
    anonKey && 
    url.startsWith('https://') && 
    !url.includes('your-project') &&
    anonKey.length > 20
  );

  return { url, anonKey, isConfigured };
};

export const saveCustomSupabaseConfig = (url: string, anonKey: string) => {
  if (url) {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  }

  if (anonKey) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  }

  // Re-instantiate client
  supabaseInstance = null;
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};

// Verified Owner and Admin constants
export const OWNER_EMAIL = 'pranjaliprasad1@gmail.com';

export const isOwnerEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase();
};

// SQL Schema for Supabase Setup Reference
export const SUPABASE_SQL_SETUP = `-- ==========================================
-- DOODLEBOARD SUPABASE DATABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor:
-- ==========================================

-- 1. PROFILES TABLE (Extends auth.users with verified and owner badges)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar_letter text,
  is_verified boolean default false,
  is_owner boolean default false,
  created_at timestamp with time zone default now()
);

-- In case profiles table already exists, add badge columns
alter table public.profiles add column if not exists is_verified boolean default false;
alter table public.profiles add column if not exists is_owner boolean default false;

-- Automatically grant owner and verified status to platform owner email
update public.profiles 
set is_verified = true, is_owner = true 
where id in (
  select id from auth.users where lower(email) = '${OWNER_EMAIL}'
);

-- 2. POSTS TABLE
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  image_url text not null,
  likes_count int default 0,
  created_at timestamp with time zone default now()
);

-- 3. LIKES TABLE
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(post_id, user_id)
);

-- 4. FOLLOWS TABLE
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(follower_id, following_id)
);

-- 5. ROW LEVEL SECURITY (RLS) SETUP
-- Option A: Allow full access or disable RLS for profiles/posts/likes/follows
alter table public.profiles disable row level security;
alter table public.posts disable row level security;
alter table public.likes disable row level security;
alter table public.follows disable row level security;

-- Or Option B: If you prefer RLS enabled with permissive policies:
-- alter table public.profiles enable row level security;
-- alter table public.posts enable row level security;
-- alter table public.likes enable row level security;
-- alter table public.follows enable row level security;

-- 6. PERMISSIVE POLICIES (If RLS is enabled)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Allow all read profiles" on public.profiles;
create policy "Allow all read profiles" 
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Allow all insert profiles" on public.profiles;
create policy "Allow all insert profiles" 
  on public.profiles for insert with check (true);

drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Allow all update profiles" on public.profiles;
create policy "Allow all update profiles" 
  on public.profiles for update using (true);

-- 7. RLS POLICIES FOR POSTS
drop policy if exists "Posts are viewable by everyone" on public.posts;
create policy "Posts are viewable by everyone" 
  on public.posts for select using (true);

drop policy if exists "Authenticated users can insert posts" on public.posts;
create policy "Authenticated users can insert posts" 
  on public.posts for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

drop policy if exists "Users can update own posts" on public.posts;
create policy "Users can update own posts" 
  on public.posts for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own posts" on public.posts;
create policy "Users can delete own posts" 
  on public.posts for delete using (auth.uid() = user_id);

-- 8. RLS POLICIES FOR LIKES
drop policy if exists "Likes are viewable by everyone" on public.likes;
create policy "Likes are viewable by everyone" 
  on public.likes for select using (true);

drop policy if exists "Authenticated users can toggle like" on public.likes;
create policy "Authenticated users can toggle like" 
  on public.likes for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

drop policy if exists "Users can delete own likes" on public.likes;
create policy "Users can delete own likes" 
  on public.likes for delete using (auth.uid() = user_id);

-- 9. RLS POLICIES FOR FOLLOWS
drop policy if exists "Follows are viewable by everyone" on public.follows;
create policy "Follows are viewable by everyone" 
  on public.follows for select using (true);

drop policy if exists "Authenticated users can follow" on public.follows;
create policy "Authenticated users can follow" 
  on public.follows for insert with check (auth.role() = 'authenticated' and auth.uid() = follower_id);

drop policy if exists "Users can unfollow" on public.follows;
create policy "Users can unfollow" 
  on public.follows for delete using (auth.uid() = follower_id);

-- 10. STORAGE BUCKET CREATION (Bucket named "drawings", public read)
insert into storage.buckets (id, name, public) 
values ('drawings', 'drawings', true)
on conflict (id) do update set public = true;

-- STORAGE POLICIES:
drop policy if exists "Public Drawing Access" on storage.objects;
create policy "Public Drawing Access" 
  on storage.objects for select using (bucket_id = 'drawings');

drop policy if exists "Authenticated Drawing Uploads" on storage.objects;
create policy "Authenticated Drawing Uploads" 
  on storage.objects for insert with check (bucket_id = 'drawings' and auth.role() = 'authenticated');

drop policy if exists "Owner Drawing Deletions" on storage.objects;
create policy "Owner Drawing Deletions" 
  on storage.objects for delete using (bucket_id = 'drawings' and auth.uid() = owner);
`;

// Helper to convert a Supabase Auth User + Profile row to app User type
export const mapProfileToUser = (
  authUser: SupabaseAuthUser, 
  profileData?: { id?: string; name?: string; avatar_letter?: string; is_verified?: boolean; is_owner?: boolean; isVerified?: boolean; isOwner?: boolean; created_at?: string } | null
): User => {
  const isOwner = Boolean(
    profileData?.is_owner || 
    profileData?.isOwner || 
    isOwnerEmail(authUser.email)
  );
  const isVerified = Boolean(
    profileData?.is_verified || 
    profileData?.isVerified || 
    isOwner || 
    authUser.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff' ||
    profileData?.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff'
  );

  const name = profileData?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Doodler';
  const avatarLetter = profileData?.avatar_letter || authUser.user_metadata?.avatar_letter || name.charAt(0).toUpperCase();
  const username = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'doodler';

  return {
    id: authUser.id,
    name,
    username: `@${username}`,
    email: authUser.email,
    avatarLetter,
    avatarColor: getRandomAvatarColor(name),
    createdAt: new Date(authUser.created_at).getTime(),
    isAnonymous: authUser.is_anonymous || !authUser.email,
    isVerified,
    isOwner,
    is_verified: isVerified,
    is_owner: isOwner,
  };
};

/**
 * Ensures a profile row exists in public.profiles table for the given user
 */
export const ensureProfileExists = async (authUser: SupabaseAuthUser, displayName?: string, avatarLetter?: string): Promise<User> => {
  const client = getSupabaseClient();
  const isOwner = isOwnerEmail(authUser.email);

  if (!client) {
    return mapProfileToUser(authUser, { 
      id: authUser.id,
      name: displayName, 
      avatar_letter: avatarLetter, 
      is_verified: isOwner || authUser.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff', 
      is_owner: isOwner 
    });
  }

  try {
    // 1. Check if profile already exists
    const { data: existingProfile, error: fetchErr } = await client
      .from('profiles')
      .select('id, name, avatar_letter, is_verified, is_owner, created_at')
      .eq('id', authUser.id)
      .maybeSingle();

    if (fetchErr) {
      console.warn('Error fetching profile from Supabase:', fetchErr.message);
    }

    if (existingProfile) {
      // If user is owner email but not marked in DB, update DB profile
      if (isOwner && (!existingProfile.is_owner || !existingProfile.is_verified)) {
        try {
          await client
            .from('profiles')
            .update({ is_owner: true, is_verified: true })
            .eq('id', authUser.id);
          existingProfile.is_owner = true;
          existingProfile.is_verified = true;
        } catch {
          // ignore error
        }
      }
      return mapProfileToUser(authUser, existingProfile);
    }

    // 2. Profile doesn't exist, create it
    const nameToUse = displayName || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Doodler';
    const letterToUse = avatarLetter || authUser.user_metadata?.avatar_letter || nameToUse.charAt(0).toUpperCase();

    const { data: newProfile, error: insertErr } = await client
      .from('profiles')
      .insert({
        id: authUser.id,
        name: nameToUse,
        avatar_letter: letterToUse,
        is_verified: isOwner || authUser.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff',
        is_owner: isOwner,
      })
      .select('id, name, avatar_letter, is_verified, is_owner, created_at')
      .single();

    if (insertErr) {
      console.warn('Could not insert profile to Supabase (RLS or table missing):', insertErr.message);
      return mapProfileToUser(authUser, { 
        id: authUser.id,
        name: nameToUse, 
        avatar_letter: letterToUse, 
        is_verified: isOwner || authUser.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff', 
        is_owner: isOwner 
      });
    }

    return mapProfileToUser(authUser, newProfile);
  } catch (err) {
    console.error('ensureProfileExists error:', err);
    return mapProfileToUser(authUser, { 
      id: authUser.id,
      name: displayName, 
      avatar_letter: avatarLetter, 
      is_verified: isOwner || authUser.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff', 
      is_owner: isOwner 
    });
  }
};

/**
 * Supabase Auth API
 */
export const supabaseAuth = {
  // Sign up with Email + Password
  signUp: async (email: string, pass: string, name: string): Promise<{ user: User | null; error: string | null }> => {
    const client = getSupabaseClient();
    if (!client) return { user: null, error: 'Supabase client is not configured' };

    const avatarLetter = name.trim().charAt(0).toUpperCase() || 'D';
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password: pass,
      options: {
        data: {
          name: name.trim(),
          avatar_letter: avatarLetter,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const user = await ensureProfileExists(data.user, name, avatarLetter);
      return { user, error: null };
    }

    return { user: null, error: 'No user returned from Supabase sign up' };
  },

  // Sign in with Email + Password
  signIn: async (email: string, pass: string): Promise<{ user: User | null; error: string | null }> => {
    const client = getSupabaseClient();
    if (!client) return { user: null, error: 'Supabase client is not configured' };

    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const user = await ensureProfileExists(data.user);
      return { user, error: null };
    }

    return { user: null, error: 'No user found' };
  },

  // Sign in anonymously with instant name
  signInAnonymously: async (name: string): Promise<{ user: User | null; error: string | null }> => {
    const client = getSupabaseClient();
    if (!client) return { user: null, error: 'Supabase client is not configured' };

    const avatarLetter = name.trim().charAt(0).toUpperCase() || 'D';
    const { data, error } = await client.auth.signInAnonymously({
      options: {
        data: {
          name: name.trim(),
          avatar_letter: avatarLetter,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const user = await ensureProfileExists(data.user, name, avatarLetter);
      return { user, error: null };
    }

    return { user: null, error: 'Failed to sign in anonymously' };
  },

  // Get current active session user
  getCurrentUser: async (): Promise<User | null> => {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session?.user) return null;

      return await ensureProfileExists(session.user);
    } catch (e) {
      console.warn('Failed to get current user from Supabase:', e);
      return null;
    }
  },

  // Update profile
  updateProfile: async (userId: string, name: string, avatarLetter?: string): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const letter = avatarLetter || name.trim().charAt(0).toUpperCase();
      const { error } = await client
        .from('profiles')
        .update({
          name: name.trim(),
          avatar_letter: letter,
        })
        .eq('id', userId);

      if (error) {
        console.warn('Failed to update profile in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Update profile error:', e);
      return false;
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
  },
};

/**
 * Posts API with Supabase Database and Storage
 */
export const supabaseDb = {
  // Fetch all posts with their creator profile information
  fetchPosts: async (): Promise<Post[]> => {
    const client = getSupabaseClient();
    if (!client) {
      return INITIAL_POSTS;
    }

    try {
      // Query posts joining profiles with verified and owner status
      let { data, error } = await client
        .from('posts')
        .select(`
          id,
          title,
          image_url,
          likes_count,
          created_at,
          user_id,
          profiles (
            id,
            name,
            avatar_letter,
            is_verified,
            is_owner,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      // Fallback query if profiles relationship is not yet registered in schema cache
      if (error || !data) {
        console.warn('Primary fetch with profiles join error, falling back to batch select:', error?.message);
        const fallback = await client
          .from('posts')
          .select('id, title, image_url, likes_count, created_at, user_id')
          .order('created_at', { ascending: false });
        
        data = fallback.data as any;
        error = fallback.error;
      }

      if (error) {
        console.warn('Supabase fetchPosts error (falling back to initial):', error.message);
        return INITIAL_POSTS;
      }

      if (!data || data.length === 0) {
        return INITIAL_POSTS;
      }

      // If profiles are missing from joined objects, batch fetch them with explicit columns
      const needsProfileFetch = data.some((item: any) => !item.profiles || (Array.isArray(item.profiles) && item.profiles.length === 0));
      let profileMap = new Map<string, any>();

      if (needsProfileFetch) {
        try {
          const userIds = Array.from(new Set(data.map((d: any) => d.user_id).filter(Boolean))) as string[];
          if (userIds.length > 0) {
            const { data: profilesList } = await client
              .from('profiles')
              .select('id, name, avatar_letter, is_verified, is_owner, created_at')
              .in('id', userIds);

            if (profilesList) {
              profilesList.forEach((p: any) => {
                profileMap.set(p.id, p);
              });
            }
          }
        } catch (pErr) {
          console.warn('Could not batch fetch profiles:', pErr);
        }
      }

      // Map rows to Post objects
      const mappedPosts: Post[] = data.map((item: any) => {
        let profile = Array.isArray(item.profiles) ? item.profiles[0] : (item.profiles || {});
        if ((!profile || !profile.name) && profileMap.has(item.user_id)) {
          profile = profileMap.get(item.user_id) || {};
        }

        const userName = profile.name || 'Doodle Creator';
        const userAvatarLetter = profile.avatar_letter || userName.charAt(0).toUpperCase();
        const userAvatarBg = getRandomAvatarColor(userName);
        const isOwner = Boolean(profile.is_owner || profile.isOwner);
        const isVerified = Boolean(
          profile.is_verified || 
          profile.isVerified || 
          isOwner || 
          item.user_id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff'
        );

        return {
          id: item.id,
          title: item.title,
          src: item.image_url,
          aspectRatio: 1.25,
          userId: item.user_id,
          userName,
          userAvatarLetter,
          userAvatarBg,
          isVerified,
          isOwner,
          is_verified: isVerified,
          is_owner: isOwner,
          likes: item.likes_count ?? 0,
          timestamp: new Date(item.created_at).getTime(),
        };
      });

      return mappedPosts;
    } catch (err) {
      console.error('Failed to fetch posts from Supabase:', err);
      return INITIAL_POSTS;
    }
  },

  // Upload image to Supabase Storage bucket 'drawings'
  uploadDrawing: async (
    fileOrBlob: Blob | File,
    fileName: string,
    userId: string
  ): Promise<string> => {
    const client = getSupabaseClient();
    if (!client) {
      // Fallback: convert to base64 Data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBlob);
      });
    }

    try {
      const fileExt = (fileName.split('.').pop() || 'png').replace(/[^a-zA-Z0-9]/g, '');
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const safeFolder = (userId || 'anon').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filePath = `${safeFolder}/${cleanFileName}`;

      const { error: uploadError } = await client.storage
        .from('drawings')
        .upload(filePath, fileOrBlob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Storage upload warning, fallback to data URL:', uploadError.message);
        // Fallback to data URL if bucket doesn't exist or RLS issue
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBlob);
        });
      }

      // Get public URL
      const { data } = client.storage.from('drawings').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (e) {
      console.error('Upload drawing error, fallback to data URL:', e);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBlob);
      });
    }
  },

  // Insert a new Post into Supabase posts table
  createPost: async (postData: {
    userId: string;
    title: string;
    imageUrl: string;
  }): Promise<Post | null> => {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      // Determine effective user ID
      let targetUserId = postData.userId;
      try {
        const { data: authData } = await client.auth.getUser();
        if (authData?.user?.id) {
          targetUserId = authData.user.id;
          await ensureProfileExists(authData.user);
        }
      } catch (authErr) {
        console.warn('Could not verify auth user before createPost:', authErr);
      }

      // Check if targetUserId is a valid UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId);
      if (!isUuid) {
        console.warn('userId is not a UUID, falling back to local post creation:', targetUserId);
        return null;
      }

      const { data, error } = await client
        .from('posts')
        .insert({
          user_id: targetUserId,
          title: postData.title,
          image_url: postData.imageUrl,
          likes_count: 0,
        })
        .select('id, title, image_url, likes_count, created_at, user_id')
        .single();

      if (error) {
        console.error('Error creating post in Supabase:', error.message);
        return null;
      }

      let userName = 'Doodle Creator';
      let userAvatarLetter = 'D';
      let isVerified = false;
      let isOwner = false;

      try {
        const { data: profile } = await client
          .from('profiles')
          .select('id, name, avatar_letter, is_verified, is_owner, created_at')
          .eq('id', data.user_id)
          .maybeSingle();

        if (profile) {
          userName = profile.name || userName;
          userAvatarLetter = profile.avatar_letter || userName.charAt(0).toUpperCase();
          isOwner = Boolean(profile.is_owner);
          isVerified = Boolean(
            profile.is_verified || 
            isOwner ||
            data.user_id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff'
          );
        }
      } catch {
        // use default
      }

      return {
        id: data.id,
        title: data.title,
        src: data.image_url,
        aspectRatio: 1.25,
        userId: data.user_id,
        userName,
        userAvatarLetter,
        userAvatarBg: getRandomAvatarColor(userName),
        isVerified,
        isOwner,
        is_verified: isVerified,
        is_owner: isOwner,
        likes: 0,
        timestamp: new Date(data.created_at).getTime(),
      };
    } catch (e) {
      console.error('Failed to create post:', e);
      return null;
    }
  },

  // Fetch single profile with all badge columns
  fetchProfile: async (userId: string) => {
    const client = getSupabaseClient();
    if (!client || !userId) return null;
    try {
      const { data, error } = await client
        .from('profiles')
        .select('id, name, avatar_letter, is_verified, is_owner, created_at')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.warn('Fetch profile error:', error.message);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  // Delete a post from Supabase
  deletePost: async (postId: string, userId: string): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) return true;

    try {
      const { error } = await client
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId);

      if (error) {
        console.warn('Failed to delete post from Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Delete post error:', e);
      return false;
    }
  },

  // Fetch likes for user
  fetchUserLikes: async (userId: string): Promise<string[]> => {
    const client = getSupabaseClient();
    if (!client || !userId) return [];

    try {
      const { data, error } = await client
        .from('likes')
        .select('post_id')
        .eq('user_id', userId);

      if (error) {
        console.warn('Fetch likes error:', error.message);
        return [];
      }

      return (data || []).map((row: any) => row.post_id);
    } catch (e) {
      console.error('Failed to fetch user likes:', e);
      return [];
    }
  },

  // Toggle like
  toggleLike: async (postId: string, userId: string, isCurrentlyLiked: boolean): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client || !userId) return true;

    try {
      if (isCurrentlyLiked) {
        // Remove like
        const { error } = await client
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (!error) {
          // Decrement likes_count
          const { data: post } = await client
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();
          if (post) {
            await client
              .from('posts')
              .update({ likes_count: Math.max(0, (post.likes_count || 1) - 1) })
              .eq('id', postId);
          }
        }
      } else {
        // Insert like
        const { error } = await client
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userId,
          });

        if (!error) {
          // Increment likes_count
          const { data: post } = await client
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();
          if (post) {
            await client
              .from('posts')
              .update({ likes_count: (post.likes_count || 0) + 1 })
              .eq('id', postId);
          }
        }
      }
      return true;
    } catch (e) {
      console.error('Toggle like error:', e);
      return false;
    }
  },

  // Fetch follows for user
  fetchUserFollows: async (followerId: string): Promise<string[]> => {
    const client = getSupabaseClient();
    if (!client || !followerId) return [];

    try {
      const { data, error } = await client
        .from('follows')
        .select('following_id')
        .eq('follower_id', followerId);

      if (error) {
        console.warn('Fetch follows error:', error.message);
        return [];
      }

      return (data || []).map((row: any) => row.following_id);
    } catch (e) {
      console.error('Failed to fetch user follows:', e);
      return [];
    }
  },

  // Toggle follow
  toggleFollow: async (followerId: string, followingId: string, isCurrentlyFollowing: boolean): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client || !followerId) return true;

    try {
      if (isCurrentlyFollowing) {
        await client
          .from('follows')
          .delete()
          .eq('follower_id', followerId)
          .eq('following_id', followingId);
      } else {
        await client
          .from('follows')
          .insert({
            follower_id: followerId,
            following_id: followingId,
          });
      }
      return true;
    } catch (e) {
      console.error('Toggle follow error:', e);
      return false;
    }
  },
};
