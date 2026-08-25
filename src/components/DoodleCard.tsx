import React from 'react';
import { Heart, Maximize2, Check, Crown } from 'lucide-react';
import { Post, User } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface DoodleCardProps {
  post: Post;
  currentUser: User | null;
  isLiked: boolean;
  isFollowing: boolean;
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
}

export const DoodleCard: React.FC<DoodleCardProps> = ({
  post,
  currentUser,
  isLiked,
  isFollowing,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
}) => {
  const isOwnPost = currentUser?.id === post.userId;
  const isOwner = Boolean(post.isOwner);

  return (
    <div
      id={`doodle-card-${post.id}`}
      className={`group relative flex flex-col mb-4 break-inside-avoid rounded-2xl bg-gray-50 overflow-hidden transition-all duration-200 ${
        isOwner
          ? 'border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_18px_rgba(245,158,11,0.25)] hover:shadow-[0_0_24px_rgba(245,158,11,0.38)]'
          : 'border border-gray-100 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Owner Top Badge Indicator */}
      {isOwner && (
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 shadow-md border border-amber-200 backdrop-blur-xs">
            <span>👑</span>
            <span>OWNER</span>
          </span>
        </div>
      )}

      {/* Image Container with hover actions */}
      <div className="relative overflow-hidden bg-gray-100">
        <div
          onClick={() => onCardClick(post)}
          className="cursor-pointer block relative w-full overflow-hidden"
        >
          <img
            src={post.src}
            alt={post.title}
            loading="lazy"
            className="w-full h-auto object-contain block transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />

          {/* Hover gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 z-10">
          <button
            type="button"
            id={`fullscreen-btn-${post.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(post);
            }}
            aria-label="View Fullscreen"
            className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-800 flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
            title="Open Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Like Overlay on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(post.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all duration-150 active:scale-95 cursor-pointer ${
              isLiked
                ? 'bg-red-600 text-white'
                : 'bg-white/95 hover:bg-white text-gray-900'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white text-white' : 'text-gray-700'}`} />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>
        </div>
      </div>

      {/* Card Info & Meta */}
      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <h3
          onClick={() => onCardClick(post)}
          className="text-sm font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-red-600 transition-colors"
          title={post.title}
        >
          {post.title}
        </h3>

        {/* User Info, Like & Follow Row */}
        <div className="flex items-center justify-between gap-1.5 pt-0.5">
          {/* Creator Avatar & Name with Verified / Owner Badges */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div
              className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center p-[1.5px] transition-transform ${
                isOwner
                  ? 'bg-gradient-to-tr from-[#1D9BF0] via-[#60A5FA] to-[#0284C7] shadow-[0_0_8px_rgba(29,155,240,0.5)]'
                  : ''
              }`}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs border border-white"
                style={{ backgroundColor: post.userAvatarBg || '#000000' }}
              >
                {post.userAvatarLetter || post.userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-xs text-gray-800 font-semibold truncate">
              {post.userName}
            </span>
            <VerifiedBadge
              is_verified={post.is_verified || post.isVerified}
              is_owner={post.is_owner || post.isOwner}
            />
          </div>

          {/* Follow Button (if not own post) */}
          {!isOwnPost && (
            <button
              type="button"
              id={`follow-btn-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(post.userId);
              }}
              className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold transition-colors duration-150 cursor-pointer ${
                isFollowing
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isFollowing ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Following
                </span>
              ) : (
                'Follow'
              )}
            </button>
          )}

          {/* Like Button with count */}
          <button
            type="button"
            id={`like-btn-${post.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(post.id);
            }}
            className={`shrink-0 flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all duration-150 active:scale-90 cursor-pointer ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100 font-semibold'
                : 'text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isLiked ? 'fill-red-600 text-red-600' : 'text-gray-500'
              }`}
            />
            <span className="text-[11px] font-medium">{post.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
