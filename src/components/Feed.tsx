import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, TrendingUp, Users, Plus, Loader2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Post, User, FilterCategory } from '../types';
import { PostCard } from './PostCard';
import { StoriesRow } from './StoriesRow';
import { getStoredPosts } from '../services/storage';

export interface FeedProps {
  currentUser: User | null;
  likedPostIds: string[];
  followedUserIds: string[];
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
  onOpenUpload: () => void;
  onViewUserProfile?: (usernameOrId: string) => void;
}

type FeedFilter = 'all' | 'trending' | 'following' | FilterCategory;

export const Feed: React.FC<FeedProps> = ({
  currentUser,
  likedPostIds,
  followedUserIds,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
  onOpenUpload,
  onViewUserProfile,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FeedFilter>('all');

  // Real-time Firestore posts subscription ordered by timestamp desc
  useEffect(() => {
    setLoading(true);

    if (!db) {
      const fallback = getStoredPosts();
      setPosts(fallback);
      setLoading(false);
      return;
    }

    try {
      const postsCol = collection(db, 'posts');
      const postsQuery = query(postsCol, orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(
        postsQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedList: Post[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              const rawImg = data.imageUrl || data.image_url || data.src || data.url || '';
              
              let timeValue = Date.now();
              if (data.timestamp) {
                if (typeof data.timestamp === 'number') {
                  timeValue = data.timestamp;
                } else if (typeof data.timestamp.toMillis === 'function') {
                  timeValue = data.timestamp.toMillis();
                } else if (typeof data.timestamp.toDate === 'function') {
                  timeValue = data.timestamp.toDate().getTime();
                }
              } else if (data.createdAt) {
                timeValue = typeof data.createdAt === 'number' ? data.createdAt : Date.now();
              }

              return {
                id: docSnap.id,
                title: data.title || 'Untitled Doodle',
                imageUrl: rawImg,
                src: rawImg || data.src || '',
                aspectRatio: data.aspectRatio || 1,
                tags: data.tags || (data.category ? [data.category] : ['Minimalist']),
                userId: data.userId || 'artist',
                userName: data.userName || data.authorName || 'Doodler',
                userUsername: data.userUsername || data.username,
                userAvatarBg: data.userAvatarBg || '#18181b',
                userAvatarLetter: data.userAvatarLetter || (data.userName ? data.userName.charAt(0).toUpperCase() : 'D'),
                userAvatarImage: data.userAvatarImage || data.avatar || data.userAvatar,
                isVerified: Boolean(data.isVerified || data.is_verified || data.verified || data.owner || data.isOwner),
                isOwner: Boolean(data.isOwner || data.is_owner || data.owner),
                is_verified: Boolean(data.isVerified || data.is_verified || data.verified || data.owner || data.isOwner),
                is_owner: Boolean(data.isOwner || data.is_owner || data.owner),
                likes: typeof data.likes === 'number' ? data.likes : (Array.isArray(data.likedBy) ? data.likedBy.length : 0),
                likedBy: data.likedBy || [],
                timestamp: timeValue,
                description: data.description || '',
              };
            });
            setPosts(fetchedList);
          } else {
            const fallback = getStoredPosts();
            setPosts(fallback);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Firestore posts query onSnapshot fallback:', error);
          const fallback = getStoredPosts();
          setPosts(fallback);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore query error:', err);
      const fallback = getStoredPosts();
      setPosts(fallback);
      setLoading(false);
    }
  }, []);

  // Filter & sort logic
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    if (selectedFilter === 'trending') {
      return list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (selectedFilter === 'following') {
      return list.filter((p) => followedUserIds.includes(p.userId));
    } else if (selectedFilter !== 'all') {
      return list.filter((p) => p.tags && p.tags.includes(selectedFilter as FilterCategory));
    }

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
    <div className="w-full min-h-screen bg-black text-white pb-20">
      
      {/* 1. Stories Carousel at Top with Your Story + Gradients */}
      <StoriesRow
        currentUser={currentUser}
        posts={posts}
        onOpenUpload={onOpenUpload}
        onViewUserProfile={onViewUserProfile}
      />

      {/* Main Feed Container */}
      <div className="max-w-[470px] mx-auto px-0 sm:px-2 pt-3 space-y-3">
        
        {/* Category & Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto px-3 sm:px-0 pb-2 no-scrollbar">
          {FILTER_PILLS.map((pill) => {
            const isActive = selectedFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setSelectedFilter(pill.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-zinc-300 border border-neutral-800'
                }`}
              >
                {pill.icon}
                <span>{pill.label}</span>
                {pill.id === 'following' && followedUserIds.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-neutral-800 text-zinc-400'}`}>
                    {followedUserIds.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="w-full space-y-4 px-3 sm:px-0">
            <div className="flex items-center justify-center gap-2 py-4 text-xs font-medium text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              <span>Loading doodles...</span>
            </div>

            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden animate-pulse"
              >
                {/* Header skeleton */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-neutral-800" />
                    <div className="space-y-1.5">
                      <div className="h-3 bg-neutral-800 rounded w-24" />
                      <div className="h-2 bg-neutral-800 rounded w-16" />
                    </div>
                  </div>
                  <div className="w-6 h-3 bg-neutral-800 rounded" />
                </div>
                {/* Aspect-square image skeleton */}
                <div className="w-full aspect-square bg-neutral-900" />
                {/* Actions skeleton */}
                <div className="p-3 space-y-2">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-800" />
                    <div className="w-6 h-6 rounded-full bg-neutral-800" />
                    <div className="w-6 h-6 rounded-full bg-neutral-800" />
                  </div>
                  <div className="h-3 bg-neutral-800 rounded w-20" />
                  <div className="h-3 bg-neutral-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          /* Instagram Posts List */
          <div id="instagram-feed-list" className="w-full space-y-3">
            {filteredPosts.map((post) => {
              const isLiked = likedPostIds.includes(post.id);
              const isFollowing = followedUserIds.includes(post.userId);

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  isLiked={isLiked}
                  isFollowing={isFollowing}
                  onLikeToggle={onLikeToggle}
                  onFollowToggle={onFollowToggle}
                  onCardClick={onCardClick}
                  onOpenUpload={onOpenUpload}
                  onUserClick={(userId, username) => {
                    if (onViewUserProfile) {
                      onViewUserProfile(username || userId);
                    }
                  }}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center space-y-3 bg-neutral-950 rounded-2xl border border-neutral-900 max-w-md mx-auto">
            {selectedFilter === 'following' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto text-zinc-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  No posts from followed creators yet
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Follow artists in the Explore tab or Stories to see their newest work here.
                </p>
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="mt-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Explore All Doodles
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto text-zinc-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  No doodles here yet
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Be the first to share your creative drawing in this category!
                </p>
                <button
                  onClick={onOpenUpload}
                  className="mt-2 px-4 py-2 bg-[#0095f6] text-white rounded-lg text-xs font-bold hover:bg-[#1877f2] transition-colors cursor-pointer"
                >
                  Create Doodle
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Feed;
