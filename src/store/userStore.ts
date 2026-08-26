import { create } from 'zustand';
import { Post, User } from '../types';
import {
  PRANJALI_GHIBLI_AVATAR,
  ELENA_GHIBLI_AVATAR,
  TETSU_GHIBLI_AVATAR,
  MAYA_GHIBLI_AVATAR,
  SAM_GHIBLI_AVATAR,
  CHLOE_GHIBLI_AVATAR,
} from '../services/mockUsers';
import { INITIAL_POSTS } from '../services/seedData';
import {
  followUserTransaction,
  unfollowUserTransaction,
  adminUpdateFirestoreUser,
  adminDeleteFirestoreUser,
  subscribeAllUsers,
} from '../firebase';

export const REAL_DATA_STORAGE_KEY = 'doodleboard_real_data';
export const ADMIN_PASSWORD = 'PRANJALI_IS_OWNER_2026';

export interface StoredUser {
  id: string;
  username: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  verified: boolean;
  owner: boolean;
  avatar: string;
  category?: string;
  location?: string;
  website?: string;
  banned?: boolean;
  featured?: boolean;
  createdAt?: number;
  highlights?: Array<{
    id: string;
    title: string;
    coverEmoji: string;
    bgColor: string;
  }>;
}

export const INITIAL_REAL_USERS: StoredUser[] = [
  {
    id: 'user-pranjali',
    username: 'pranjali',
    name: 'Pranjali Prasad',
    bio: '👑 Founder & Lead Creator @ DoodleBoard\n🌿 Studio Ghibli dreamer & visual storyteller\n✨ Building whimsical worlds one brushstroke at a time',
    followers: 0,
    following: 0,
    verified: true,
    owner: true,
    avatar: PRANJALI_GHIBLI_AVATAR,
    category: 'Founder & Visual Artist',
    location: 'Tokyo / San Francisco',
    website: 'pranjali.art',
    banned: false,
    featured: true,
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    highlights: [
      { id: 'h1', title: '🌿 Ghibli', coverEmoji: '✨', bgColor: 'bg-emerald-100 text-emerald-800' },
      { id: 'h2', title: '🎨 Sketches', coverEmoji: '🖌️', bgColor: 'bg-blue-100 text-blue-800' },
      { id: 'h3', title: '☕ Studio', coverEmoji: '☕', bgColor: 'bg-amber-100 text-amber-800' },
    ]
  },
  {
    id: 'user-elena',
    username: 'elena_sketches',
    name: 'Elena Rostova',
    bio: '🏛️ Architectural sketches & brutalist forms\n☕ Pour-over enthusiast & ink on Moleskine\n📐 Exploring light, raw concrete & shadows',
    followers: 0,
    following: 0,
    verified: false,
    owner: false,
    avatar: ELENA_GHIBLI_AVATAR,
    category: 'Architectural Artist',
    location: 'Prague, Czech Republic',
    website: 'elenarostova.design',
    banned: false,
    featured: true,
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    highlights: [
      { id: 'h1', title: '🏛️ Arches', coverEmoji: '🏛️', bgColor: 'bg-indigo-100 text-indigo-800' },
      { id: 'h2', title: '☕ Coffee', coverEmoji: '☕', bgColor: 'bg-amber-100 text-amber-800' },
    ]
  },
  {
    id: 'user-tetsu',
    username: 'tetsu_art',
    name: 'Tetsu Tanaka',
    bio: '🌿 Tokyo-based botanical illustrator & foliage lover\n🍜 Late-night tonkotsu broth & quiet bamboo gardens\n🍵 Gouache, sumi ink & Japanese moss studies',
    followers: 0,
    following: 0,
    verified: false,
    owner: false,
    avatar: TETSU_GHIBLI_AVATAR,
    category: 'Botanical Artist',
    location: 'Shibuya, Tokyo',
    website: 'tetsutanaka.jp',
    banned: false,
    featured: true,
    createdAt: Date.now() - 280 * 24 * 60 * 60 * 1000,
    highlights: [
      { id: 'h1', title: '🌿 Foliage', coverEmoji: '🌱', bgColor: 'bg-emerald-100 text-emerald-800' },
      { id: 'h2', title: '🍜 Food', coverEmoji: '🍜', bgColor: 'bg-orange-100 text-orange-800' },
    ]
  },
  {
    id: 'user-maya',
    username: 'maya_doodles',
    name: 'Maya Lin',
    bio: "🐱 Children's storybook author & cozy comic maker\n🥞 Calico cat mom, watercolor washes & warm maple syrup\n✨ Making everyday moments feel like picture books",
    followers: 0,
    following: 0,
    verified: false,
    owner: false,
    avatar: MAYA_GHIBLI_AVATAR,
    category: 'Storybook Artist',
    location: 'Seattle, WA',
    website: 'mayalinbooks.com',
    banned: false,
    featured: true,
    createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
    highlights: [
      { id: 'h1', title: '🐱 Cats', coverEmoji: '🐾', bgColor: 'bg-amber-100 text-amber-800' },
      { id: 'h2', title: '🥞 Cozy', coverEmoji: '🥞', bgColor: 'bg-yellow-100 text-yellow-800' },
    ]
  },
  {
    id: 'user-sam',
    username: 'sam_cosmic',
    name: 'Sam K.',
    bio: '🚀 Cosmic dreamer & minimalist character artist\n🪐 Stargazing, retro sci-fi aesthetics & floating void linework\n🌌 Exploring outer space from a desk in Berlin',
    followers: 0,
    following: 0,
    verified: false,
    owner: false,
    avatar: SAM_GHIBLI_AVATAR,
    category: 'Visual & Sci-Fi Artist',
    location: 'Berlin, Germany',
    website: 'samkcosmic.design',
    banned: false,
    featured: true,
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    highlights: [
      { id: 'h1', title: '🚀 Space', coverEmoji: '🌌', bgColor: 'bg-blue-100 text-blue-800' },
      { id: 'h2', title: '🪐 Sci-Fi', coverEmoji: '🛸', bgColor: 'bg-slate-100 text-slate-800' },
    ]
  },
  {
    id: 'user-chloe',
    username: 'chloe_analog',
    name: 'Chloe Bennett',
    bio: '📷 Vintage camera collector & analog film illustrator\n🎞️ Loose strokes, warm grain & documenting fleeting street moments\n🌾 Coffee, 35mm rolls & retro mechanical souls',
    followers: 0,
    following: 0,
    verified: false,
    owner: false,
    avatar: CHLOE_GHIBLI_AVATAR,
    category: 'Analog Illustrator',
    location: 'Melbourne, Australia',
    website: 'chloeanalog.co',
    banned: false,
    featured: true,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    highlights: [
      { id: 'h1', title: '📷 Film', coverEmoji: '🎞️', bgColor: 'bg-pink-100 text-pink-800' },
      { id: 'h2', title: '☕ Life', coverEmoji: '🛵', bgColor: 'bg-red-100 text-red-800' },
    ]
  }
];

// Helper to format numbers cleanly: 1000 -> 1K, 1500 -> 1.5K, 1000000 -> 1M
export function formatFollowerCountReal(count: number): string {
  if (count === undefined || count === null || isNaN(count)) return '0';
  if (count < 0) return '0';
  if (count < 1000) return count.toLocaleString();
  if (count < 10000) {
    const k = count / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  if (count < 1000000) {
    const k = count / 1000;
    return k >= 100 ? `${Math.round(k)}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  const m = count / 1000000;
  return m % 1 === 0 ? `${m}M` : `${m.toFixed(1).replace(/\.0$/, '')}M`;
}

interface StoredDataStructure {
  users: StoredUser[];
  posts: Post[];
  followedIds?: string[];
  likedIds?: string[];
}

function loadInitialData(): StoredDataStructure {
  try {
    const raw = localStorage.getItem(REAL_DATA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
        return {
          users: parsed.users,
          posts: Array.isArray(parsed.posts) && parsed.posts.length > 0 ? parsed.posts : INITIAL_POSTS,
          followedIds: Array.isArray(parsed.followedIds) ? parsed.followedIds : [],
          likedIds: Array.isArray(parsed.likedIds) ? parsed.likedIds : [],
        };
      }
    }
  } catch (err) {
    console.error('Error loading real store from localStorage:', err);
  }

  return {
    users: INITIAL_REAL_USERS,
    posts: INITIAL_POSTS,
    followedIds: [],
    likedIds: [],
  };
}

function persistToStorage(data: StoredDataStructure) {
  try {
    localStorage.setItem(REAL_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error persisting to localStorage:', err);
  }
}

export interface UserStoreState {
  users: StoredUser[];
  posts: Post[];
  followedIds: string[];
  likedIds: string[];
  isAdminAuthenticated: boolean;

  // Actions
  setAdminAuthenticated: (auth: boolean) => void;
  getUserById: (id: string) => StoredUser | undefined;
  getUserByUsername: (username: string) => StoredUser | undefined;
  
  // Real Follow Action (increments follower count)
  followUser: (targetUserId: string, currentUserId?: string) => void;
  unfollowUser: (targetUserId: string, currentUserId?: string) => void;
  toggleFollow: (targetUserId: string) => boolean;

  // Admin & User Modifications
  updateUser: (id: string, updates: Partial<StoredUser>) => void;
  setFollowers: (userId: string, count: number) => void;
  setFollowing: (userId: string, count: number) => void;
  toggleVerified: (userId: string) => void;
  toggleOwner: (userId: string) => void;
  toggleBanned: (userId: string) => void;
  toggleFeatured: (userId: string) => void;
  saveAllUsers: (users: StoredUser[]) => void;
  resetAll: () => void;
  addUser: (user: StoredUser) => void;
  deleteUser: (id: string) => void;
  importJSON: (jsonString: string) => boolean;
  exportJSON: () => string;

  // Post Actions
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
}

export const useUserStore = create<UserStoreState>((set, get) => {
  const initial = loadInitialData();

  return {
    users: initial.users,
    posts: initial.posts,
    followedIds: initial.followedIds || [],
    likedIds: initial.likedIds || [],
    isAdminAuthenticated: false,

    setAdminAuthenticated: (auth) => set({ isAdminAuthenticated: auth }),

    getUserById: (id: string) => {
      const { users } = get();
      if (!id) return undefined;
      const clean = id.toLowerCase().trim();
      return users.find(
        (u) =>
          u.id.toLowerCase() === clean ||
          u.username.toLowerCase() === clean ||
          (clean.includes('pranjali') && (u.username === 'pranjali' || u.owner))
      );
    },

    getUserByUsername: (username: string) => {
      const { users } = get();
      if (!username) return undefined;
      const clean = username.replace(/^@/, '').toLowerCase().trim();
      return users.find(
        (u) =>
          u.username.toLowerCase() === clean ||
          u.id.toLowerCase() === clean ||
          (clean === 'pranjali' && (u.username === 'pranjali' || u.owner))
      );
    },

    followUser: (targetUserId: string, currentUserId?: string) => {
      // Trigger Firestore transaction asynchronously
      const follower = currentUserId || 'user-current';
      followUserTransaction(follower, targetUserId).catch(console.warn);

      set((state) => {
        if (state.followedIds.includes(targetUserId)) return state;

        const newFollowed = [...state.followedIds, targetUserId];
        const newUsers = state.users.map((u) => {
          if (u.id === targetUserId || u.username.toLowerCase() === targetUserId.toLowerCase()) {
            return { ...u, followers: Math.max(0, (u.followers || 0) + 1) };
          }
          return u;
        });

        const updated = {
          ...state,
          users: newUsers,
          followedIds: newFollowed,
        };

        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });

        return updated;
      });
    },

    unfollowUser: (targetUserId: string, currentUserId?: string) => {
      // Trigger Firestore transaction asynchronously
      const follower = currentUserId || 'user-current';
      unfollowUserTransaction(follower, targetUserId).catch(console.warn);

      set((state) => {
        if (!state.followedIds.includes(targetUserId)) return state;

        const newFollowed = state.followedIds.filter((id) => id !== targetUserId);
        const newUsers = state.users.map((u) => {
          if (u.id === targetUserId || u.username.toLowerCase() === targetUserId.toLowerCase()) {
            return { ...u, followers: Math.max(0, (u.followers || 0) - 1) };
          }
          return u;
        });

        const updated = {
          ...state,
          users: newUsers,
          followedIds: newFollowed,
        };

        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });

        return updated;
      });
    },

    toggleFollow: (targetUserId: string) => {
      const { followedIds, followUser, unfollowUser } = get();
      const isFollowing = followedIds.includes(targetUserId);
      if (isFollowing) {
        unfollowUser(targetUserId);
        return false;
      } else {
        followUser(targetUserId);
        return true;
      }
    },

    updateUser: (id: string, updates: Partial<StoredUser>) => {
      set((state) => {
        const newUsers = state.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
        
        // Also update posts author info if username / name / avatar / verified / owner changed
        const newPosts = state.posts.map((p) => {
          if (p.userId === id) {
            return {
              ...p,
              userName: updates.name ?? p.userName,
              userUsername: updates.username ?? p.userUsername,
              userAvatarImage: updates.avatar ?? p.userAvatarImage,
              isVerified: updates.verified !== undefined ? updates.verified : p.isVerified,
              is_verified: updates.verified !== undefined ? updates.verified : p.is_verified,
              isOwner: updates.owner !== undefined ? updates.owner : p.isOwner,
              is_owner: updates.owner !== undefined ? updates.owner : p.is_owner,
            };
          }
          return p;
        });

        const updated = { ...state, users: newUsers, posts: newPosts };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },

    setFollowers: (userId: string, count: number) => {
      const safeCount = Math.max(0, Math.min(10000000, Number(count) || 0));
      get().updateUser(userId, { followers: safeCount });
    },

    setFollowing: (userId: string, count: number) => {
      const safeCount = Math.max(0, Math.min(10000000, Number(count) || 0));
      get().updateUser(userId, { following: safeCount });
    },

    toggleVerified: (userId: string) => {
      const user = get().getUserById(userId);
      if (!user) return;
      get().updateUser(userId, { verified: !user.verified });
    },

    toggleOwner: (userId: string) => {
      const user = get().getUserById(userId);
      if (!user) return;
      get().updateUser(userId, { owner: !user.owner });
    },

    toggleBanned: (userId: string) => {
      const user = get().getUserById(userId);
      if (!user) return;
      get().updateUser(userId, { banned: !user.banned });
    },

    toggleFeatured: (userId: string) => {
      const user = get().getUserById(userId);
      if (!user) return;
      get().updateUser(userId, { featured: !user.featured });
    },

    saveAllUsers: (users: StoredUser[]) => {
      set((state) => {
        const updated = { ...state, users };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },

    resetAll: () => {
      set((state) => {
        const updated = {
          ...state,
          users: INITIAL_REAL_USERS,
          posts: INITIAL_POSTS,
          followedIds: [],
          likedIds: [],
        };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },

    addUser: (newUser: StoredUser) => {
      set((state) => {
        const newUsers = [...state.users, newUser];
        const updated = { ...state, users: newUsers };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },

    deleteUser: (id: string) => {
      set((state) => {
        const newUsers = state.users.filter((u) => u.id !== id);
        const updated = { ...state, users: newUsers };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },

    importJSON: (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed && Array.isArray(parsed.users)) {
          set((state) => {
            const newUsers = parsed.users;
            const newPosts = Array.isArray(parsed.posts) ? parsed.posts : state.posts;
            const updated = { ...state, users: newUsers, posts: newPosts };
            persistToStorage({
              users: updated.users,
              posts: updated.posts,
              followedIds: updated.followedIds,
              likedIds: updated.likedIds,
            });
            return updated;
          });
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to import JSON:', err);
        return false;
      }
    },

    exportJSON: () => {
      const { users, posts, followedIds, likedIds } = get();
      return JSON.stringify({ users, posts, followedIds, likedIds }, null, 2);
    },

    addPost: (post: Post) => {
      set((state) => {
        const newPosts = [post, ...state.posts];
        const updated = { ...state, posts: newPosts };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },

    deletePost: (postId: string) => {
      set((state) => {
        const newPosts = state.posts.filter((p) => p.id !== postId);
        const updated = { ...state, posts: newPosts };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },

    toggleLikePost: (postId: string) => {
      set((state) => {
        const isLiked = state.likedIds.includes(postId);
        const newLikedIds = isLiked
          ? state.likedIds.filter((id) => id !== postId)
          : [...state.likedIds, postId];

        const newPosts = state.posts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1)),
              likedBy: isLiked
                ? (p.likedBy || []).filter((u) => u !== 'current-user')
                : [...(p.likedBy || []), 'current-user'],
            };
          }
          return p;
        });

        const updated = { ...state, likedIds: newLikedIds, posts: newPosts };
        persistToStorage({
          users: updated.users,
          posts: updated.posts,
          followedIds: updated.followedIds,
          likedIds: updated.likedIds,
        });
        return updated;
      });
    },
  };
});
