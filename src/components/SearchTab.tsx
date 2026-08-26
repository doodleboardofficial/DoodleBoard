import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Heart, MessageCircle, Maximize2 } from 'lucide-react';
import { Post, User, FilterCategory } from '../types';
import { MOCK_USERS } from '../services/mockUsers';
import { VerifiedBadge } from './VerifiedBadge';

interface SearchTabProps {
  posts: Post[];
  currentUser: User | null;
  likedPostIds: string[];
  followedUserIds: string[];
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onViewUserProfile?: (usernameOrId: string) => void;
}

const CATEGORIES: FilterCategory[] = [
  'All',
  'Minimalist',
  'Botanical',
  'Characters',
  'Architecture',
  'Animals',
  'Abstract',
  'Daily Life',
];

const POPULAR_SEARCHES = [
  'Pranjali',
  'Ghibli',
  'Botanical',
  'Anime',
  'Minimalist',
  'Cat',
  'Coffee',
  'Cyberpunk',
];

export const SearchTab: React.FC<SearchTabProps> = ({
  posts,
  currentUser,
  likedPostIds,
  followedUserIds,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
  searchQuery,
  setSearchQuery,
  onViewUserProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'following'>('latest');

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by text search
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.userName.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.tags && p.tags.includes(selectedCategory));
    }

    // Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'following') {
      result = result.filter((p) => followedUserIds.includes(p.userId));
    } else {
      result.sort((a, b) => b.timestamp - a.timestamp);
    }

    return result;
  }, [posts, searchQuery, selectedCategory, sortBy, followedUserIds]);

  return (
    <div className="w-full min-h-screen bg-black text-white px-3 sm:px-6 py-4 space-y-4 max-w-5xl mx-auto pb-20">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          id="search-tab-input"
          type="text"
          placeholder="Search drawings, artists, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 focus:bg-neutral-800 text-xs text-white placeholder-zinc-500 rounded-xl border border-neutral-800 focus:border-neutral-700 focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-zinc-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Suggested Quick Searches */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-zinc-500 mr-1 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Trending:
        </span>
        {POPULAR_SEARCHES.map((keyword) => (
          <button
            key={keyword}
            onClick={() => setSearchQuery(keyword)}
            className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-zinc-300 font-medium transition-colors cursor-pointer"
          >
            #{keyword}
          </button>
        ))}
      </div>

      {/* Category Pills & Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-neutral-900">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-zinc-300 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto text-xs bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              sortBy === 'latest' ? 'bg-neutral-800 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              sortBy === 'popular' ? 'bg-neutral-800 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Top Liked
          </button>
          <button
            onClick={() => setSortBy('following')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              sortBy === 'following' ? 'bg-neutral-800 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Featured Artists Stories / Avatars Row */}
      <div className="pt-2">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            Featured Creators
          </span>
          <span className="text-[11px] text-zinc-500">Discover</span>
        </div>
        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 no-scrollbar">
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => onViewUserProfile && onViewUserProfile(user.username)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              <div
                className={`relative rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                  user.isOwner
                    ? 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 shadow-sm'
                    : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]'
                }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden p-[1px] bg-black">
                  <img
                    src={user.avatarImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-zinc-300 truncate max-w-[64px] flex items-center gap-0.5 group-hover:text-white">
                {user.name.split(' ')[0]}
                <VerifiedBadge is_verified={user.isVerified} is_owner={user.isOwner} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Instagram Explore 3-Column Square Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-2">
          {filteredPosts.map((post) => {
            const isLiked = likedPostIds.includes(post.id);
            const rawSrc = post.imageUrl || post.src || post.image_url || '';
            const fallbackSrc = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={post.id}
                onClick={() => onCardClick(post)}
                className="group relative aspect-square bg-neutral-950 overflow-hidden cursor-pointer rounded-xs sm:rounded-md"
              >
                <img
                  src={rawSrc || fallbackSrc}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackSrc;
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Hover Dark Overlay with Likes and Comments count */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white select-none">
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                    <span>{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{Math.floor((post.likes || 1) / 3)}</span>
                  </div>
                </div>

                {/* Owner indicator badge */}
                {(post.isOwner || post.is_owner) && (
                  <span className="absolute top-1 left-1 text-[10px] bg-black/60 backdrop-blur-xs px-1 rounded">
                    👑
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-3 bg-neutral-950 rounded-2xl border border-neutral-900">
          <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto text-zinc-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">
            No doodles match your search
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try checking for spelling, simpler keywords, or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSortBy('latest');
            }}
            className="mt-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            View All Doodles
          </button>
        </div>
      )}

    </div>
  );
};
