export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  bio?: string;
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
  aspectRatio: number; // height / width
  tags?: string[];
  userId: string;
  userName: string;
  userAvatarBg?: string;
  userAvatarLetter?: string;
  isVerified?: boolean;
  isOwner?: boolean;
  is_verified?: boolean;
  is_owner?: boolean;
  likes: number;
  likedBy?: string[];
  timestamp: number;
  description?: string;
}

export type TabType = 'home' | 'search' | 'profile';

export type FilterCategory = 'All' | 'Minimalist' | 'Botanical' | 'Characters' | 'Architecture' | 'Animals' | 'Abstract' | 'Daily Life';

export interface SupabaseConfigState {
  isConfigured: boolean;
  url: string;
  hasKey: boolean;
}
