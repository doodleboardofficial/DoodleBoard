export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  website?: string;
  location?: string;
  category?: string;
  followersCount?: number;
  followingCount?: number;
  avatarLetter: string;
  avatarColor: string;
  avatarImage?: string;
  createdAt: number;
  isAnonymous?: boolean;
  isVerified?: boolean;
  isOwner?: boolean;
  is_verified?: boolean;
  is_owner?: boolean;
}

export interface Post {
  id: string;
  title: string;
  src: string;
  imageUrl?: string;
  image_url?: string;
  url?: string;
  aspectRatio?: number; // height / width
  tags?: string[];
  userId: string;
  userName: string;
  userUsername?: string;
  userAvatarBg?: string;
  userAvatarLetter?: string;
  userAvatarImage?: string;
  isVerified?: boolean;
  isOwner?: boolean;
  is_verified?: boolean;
  is_owner?: boolean;
  likes: number;
  likedBy?: string[];
  timestamp: number;
  description?: string;
}

export type TabType = 'home' | 'search' | 'activity' | 'profile' | 'public_profile';

export type FilterCategory = 'All' | 'Minimalist' | 'Botanical' | 'Characters' | 'Architecture' | 'Animals' | 'Abstract' | 'Daily Life';

export interface SupabaseConfigState {
  isConfigured: boolean;
  url: string;
  hasKey: boolean;
}
