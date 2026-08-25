import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, Users, Flame, Plus } from 'lucide-react';
import { Post, User, FilterCategory } from '../types';
import { MasonryGrid } from './MasonryGrid';

interface HomeFeedProps {
  posts: Post[];
  currentUser: User | null;
  likedPostIds: string[];
  followedUserIds: string[];
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
  onOpenUpload: () => void;
}

type FeedFilter = 'all' | 'trending' | 'following' | FilterCategory;

export const HomeFeed: React.FC<HomeFeedProps> = ({
  posts,
  currentUser,
  likedPostIds,
  followedUserIds,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
  onOpenUpload,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FeedFilter>('all');

  const filteredPosts = useMemo(() => {
    let list = [...posts];

    if (selectedFilter === 'trending') {
      // Sort by likes
      return list.sort((a, b) => b.likes - a.likes);
    } else if (selectedFilter === 'following') {
      // Filter by followed users
      return list.filter((p) => followedUserIds.includes(p.userId));
    } else if (selectedFilter !== 'all') {
      // Category filter
      return list.filter((p) => p.tags && p.tags.includes(selectedFilter as FilterCategory));
    }

    // Default 'all': chronological
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [posts, selectedFilter, followedUserIds]);

  const FILTER_PILLS: { id: FeedFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Doodles' },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'following', label: 'Following', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'Minimalist', label: 'Minimalist' },
    { id: 'Botanical', label: 'Botanical' },
    { id: 'Characters', label: 'Characters' },
    { id: 'Animals', label: 'Animals' },
    { id: 'Daily Life', label: 'Daily Life' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-5">
      
      {/* Category & Stream Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
        {FILTER_PILLS.map((pill) => {
          const isActive = selectedFilter === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setSelectedFilter(pill.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {pill.icon}
              <span>{pill.label}</span>
              {pill.id === 'following' && followedUserIds.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                  {followedUserIds.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Masonry Grid */}
      {filteredPosts.length > 0 ? (
        <MasonryGrid
          posts={filteredPosts}
          currentUser={currentUser}
          likedPostIds={likedPostIds}
          followedUserIds={followedUserIds}
          onLikeToggle={onLikeToggle}
          onFollowToggle={onFollowToggle}
          onCardClick={onCardClick}
        />
      ) : (
        <div className="py-20 text-center space-y-3 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto">
          {selectedFilter === 'following' ? (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-200/80 flex items-center justify-center mx-auto text-gray-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No posts from followed creators yet
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore the feed and tap "Follow" on artists whose doodle style you love!
              </p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="mt-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Browse All Doodles
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-200/80 flex items-center justify-center mx-auto text-gray-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No doodles in this category yet
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Be the first to post a sketch in this category!
              </p>
              <button
                onClick={onOpenUpload}
                className="mt-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Upload a Doodle
              </button>
            </>
          )}
        </div>
      )}

      {/* Floating Desktop Quick Upload button */}
      <div className="hidden sm:block fixed bottom-8 right-8 z-30">
        <button
          id="floating-desktop-upload-btn"
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Upload new drawing"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Upload</span>
        </button>
      </div>

    </div>
  );
};
