import { Post, User } from '../types';
import { INITIAL_POSTS } from './seedData';

const KEYS = {
  USER: 'db_user',
  POSTS: 'db_posts',
  FOLLOWS: 'db_follows',
  LIKES: 'db_likes',
};

const AVATAR_COLORS = [
  '#2563EB', '#4F46E5', '#7C3AED', '#DB2777', 
  '#DC2626', '#D97706', '#059669', '#0891B2', '#4B5563'
];

export const getRandomAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const getStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem(KEYS.USER);
    if (!data) return null;
    const user = JSON.parse(data) as User;
    if (user) {
      const isOwner = Boolean(user.isOwner || user.is_owner || (user.email && user.email.toLowerCase() === 'pranjaliprasad1@gmail.com'));
      const isVerified = Boolean(
        user.isVerified || 
        user.is_verified || 
        isOwner || 
        user.id === '4705b73f-fd8f-4e07-a0d1-f3d78c4b4eff'
      );
      user.isOwner = isOwner;
      user.isVerified = isVerified;
      user.is_owner = isOwner;
      user.is_verified = isVerified;
    }
    return user;
  } catch (e) {
    console.error('Failed to parse db_user from localStorage', e);
    return null;
  }
};

export const saveStoredUser = (user: User): void => {
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save db_user to localStorage', e);
  }
};

export const getStoredPosts = (): Post[] => {
  try {
    const data = localStorage.getItem(KEYS.POSTS);
    if (!data) {
      // Seed default posts
      localStorage.setItem(KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    const parsed = JSON.parse(data) as Post[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to get db_posts, using initial', e);
    return INITIAL_POSTS;
  }
};

export const saveStoredPosts = (posts: Post[]): void => {
  try {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save db_posts to localStorage', e);
  }
};

export const getStoredFollows = (): string[] => {
  try {
    const data = localStorage.getItem(KEYS.FOLLOWS);
    if (!data) return [];
    return JSON.parse(data) as string[];
  } catch (e) {
    console.error('Failed to get db_follows', e);
    return [];
  }
};

export const saveStoredFollows = (follows: string[]): void => {
  try {
    localStorage.setItem(KEYS.FOLLOWS, JSON.stringify(follows));
  } catch (e) {
    console.error('Failed to save db_follows', e);
  }
};

export const getStoredLikes = (): string[] => {
  try {
    const data = localStorage.getItem(KEYS.LIKES);
    if (!data) return [];
    return JSON.parse(data) as string[];
  } catch (e) {
    console.error('Failed to get db_likes', e);
    return [];
  }
};

export const saveStoredLikes = (likes: string[]): void => {
  try {
    localStorage.setItem(KEYS.LIKES, JSON.stringify(likes));
  } catch (e) {
    console.error('Failed to save db_likes', e);
  }
};

export const createNewUser = (name: string, bio?: string, avatarImage?: string): User => {
  const cleanName = name.trim() || 'Doodler';
  const username = cleanName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'doodler';
  const avatarLetter = cleanName.charAt(0).toUpperCase();
  const avatarColor = getRandomAvatarColor(cleanName);

  const newUser: User = {
    id: 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    name: cleanName,
    username: `@${username}`,
    bio: bio?.trim() || 'Sketching ideas and visual doodles ✏️',
    avatarLetter,
    avatarColor,
    avatarImage,
    createdAt: Date.now(),
  };

  saveStoredUser(newUser);
  return newUser;
};

export const resetToDemoData = (): { posts: Post[], user: User | null } => {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
  localStorage.setItem(KEYS.FOLLOWS, JSON.stringify([]));
  localStorage.setItem(KEYS.LIKES, JSON.stringify([]));
  return {
    posts: INITIAL_POSTS,
    user: getStoredUser(),
  };
};
