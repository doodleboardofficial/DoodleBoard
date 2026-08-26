import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Maximize2,
  Check,
  Sparkles,
} from 'lucide-react';
import { Post, User } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

export interface PostCardProps {
  post: Post;
  currentUser?: User | null;
  isLiked?: boolean;
  isFollowing?: boolean;
  onLikeToggle?: (postId: string) => void;
  onFollowToggle?: (userId: string) => void;
  onCardClick?: (post: Post) => void;
  onUserClick?: (userId: string, username?: string) => void;
  onOpenUpload?: () => void;
}

const FALLBACK_DOODLE_IMG =
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=80';

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  isLiked = false,
  isFollowing = false,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
  onUserClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [heartBurstKey, setHeartBurstKey] = useState<number | null>(null);
  const [isButtonPopping, setIsButtonPopping] = useState(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<
    { id: string; user: string; text: string }[]
  >([]);

  const isOwnPost = currentUser?.id === post.userId;
  const isOwner = Boolean(post.isOwner || post.is_owner);

  // Extract candidate image source
  const rawImageUrl = post.imageUrl || post.src || post.image_url || post.url || '';

  // Check if dataURL or blob
  const isDataUrl = Boolean(
    rawImageUrl && (rawImageUrl.startsWith('data:') || rawImageUrl.startsWith('blob:'))
  );

  // Determine effective display image with fallback
  const displayImage = imgError || !rawImageUrl ? FALLBACK_DOODLE_IMG : rawImageUrl;

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(post.userId, post.userUsername || post.userName);
    }
  };

  // Trigger heart burst animation and like action
  const triggerHeartBurst = () => {
    const burstId = Date.now();
    setHeartBurstKey(burstId);
    setIsButtonPopping(true);
    setTimeout(() => {
      setIsButtonPopping(false);
    }, 450);

    // If not liked, trigger like toggle
    if (!isLiked && onLikeToggle) {
      onLikeToggle(post.id);
    }
  };

  // Double tap handler supporting both touch and desktop clicks
  const handleImageTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_THRESHOLD = 320; // ms

    if (now - lastTapTime < DOUBLE_TAP_THRESHOLD) {
      // Double-tap detected
      triggerHeartBurst();
      setLastTapTime(0); // Reset
    } else {
      setLastTapTime(now);
    }
  };

  const handleLikeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsButtonPopping(true);
    setTimeout(() => setIsButtonPopping(false), 450);
    if (onLikeToggle) {
      onLikeToggle(post.id);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: currentUser?.username || 'you',
        text: commentText.trim(),
      },
    ]);
    setCommentText('');
  };

  const formatTimestamp = (time: number) => {
    if (!time) return 'JUST NOW';
    const diffHours = Math.floor((Date.now() - time) / (1000 * 60 * 60));
    if (diffHours < 1) return 'JUST NOW';
    if (diffHours < 24) return `${diffHours} HOURS AGO`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 DAY AGO';
    return `${diffDays} DAYS AGO`;
  };

  return (
    <article
      id={`post-card-${post.id}`}
      className="w-full bg-black border-b border-neutral-900 sm:border sm:rounded-xl sm:border-neutral-900 sm:my-3 overflow-hidden text-white font-sans transition-all"
    >
      {/* 1. Header: Avatar, Username, Badge, More */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div
          onClick={handleUserClick}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          {/* Avatar with subtle gradient border */}
          <div
            className={`w-9 h-9 rounded-full p-[2px] ${
              isOwner
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-xs'
                : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]'
            }`}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-[1px]">
              {post.userAvatarImage ? (
                <img
                  src={post.userAvatarImage}
                  alt={post.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: post.userAvatarBg || '#18181b' }}
                >
                  {post.userAvatarLetter ||
                    (post.userName ? post.userName.charAt(0).toUpperCase() : 'D')}
                </div>
              )}
            </div>
          </div>

          {/* Username + Category */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-zinc-300 transition-colors">
                {post.userUsername || post.userName.toLowerCase().replace(/\s+/g, '_')}
              </span>
              <VerifiedBadge
                is_verified={post.is_verified || post.isVerified}
                is_owner={post.is_owner || post.isOwner}
              />
              {isOwner && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
                  OWNER
                </span>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <span className="text-[10px] text-zinc-400">
                {post.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* Right side: Follow button + Options */}
        <div className="flex items-center gap-2">
          {!isOwnPost && onFollowToggle && (
            <button
              type="button"
              id={`follow-btn-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(post.userId);
              }}
              className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors cursor-pointer ${
                isFollowing
                  ? 'bg-neutral-800 text-zinc-300 hover:bg-neutral-700'
                  : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}

          <button
            type="button"
            onClick={() => onCardClick && onCardClick(post)}
            aria-label="View Fullscreen"
            className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Post Image (Aspect Square) with Double-Tap Heart Burst */}
      <div
        className="relative w-full aspect-square bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer select-none"
        onClick={handleImageTap}
        onDoubleClick={triggerHeartBurst}
        onTouchEnd={handleImageTap}
      >
        {isDataUrl ? (
          <img
            src={displayImage}
            alt={post.title || 'Doodle art'}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full aspect-square object-cover block select-none"
          />
        ) : (
          <img
            src={displayImage}
            alt={post.title || 'Doodle art'}
            loading="lazy"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full aspect-square object-cover block select-none"
          />
        )}

        {/* Big Heart Burst Animation on Double Tap */}
        {heartBurstKey && (
          <div
            key={heartBurstKey}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            {/* Center Popping Heart */}
            <div className="relative flex items-center justify-center animate-ig-heart">
              <Heart className="w-28 h-28 sm:w-32 sm:h-32 fill-white text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.85)] filter" />
              
              {/* Outer floating burst particles */}
              <span
                className="absolute w-3 h-3 rounded-full bg-red-400 animate-ig-particle"
                style={{ '--particle-dest': 'translate(-40px, -50px)' } as React.CSSProperties}
              />
              <span
                className="absolute w-2.5 h-2.5 rounded-full bg-white animate-ig-particle"
                style={{ '--particle-dest': 'translate(45px, -45px)' } as React.CSSProperties}
              />
              <span
                className="absolute w-3.5 h-3.5 rounded-full bg-red-500 animate-ig-particle"
                style={{ '--particle-dest': 'translate(-50px, 40px)' } as React.CSSProperties}
              />
              <span
                className="absolute w-2 h-2 rounded-full bg-white animate-ig-particle"
                style={{ '--particle-dest': 'translate(55px, 35px)' } as React.CSSProperties}
              />
              <span
                className="absolute w-3 h-3 rounded-full bg-amber-300 animate-ig-particle"
                style={{ '--particle-dest': 'translate(0px, -65px)' } as React.CSSProperties}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Buttons: Heart, Comment, Share, Bookmark */}
      <div className="px-3.5 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            type="button"
            id={`like-btn-${post.id}`}
            onClick={handleLikeButtonClick}
            aria-label={isLiked ? 'Unlike' : 'Like'}
            className={`cursor-pointer transition-transform ${
              isButtonPopping ? 'animate-ig-button-pop' : 'active:scale-75'
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-150 ${
                isLiked ? 'fill-[#ff3040] text-[#ff3040]' : 'text-white hover:text-zinc-400'
              }`}
            />
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={() => setShowCommentInput(!showCommentInput)}
            aria-label="Comment"
            className="text-white hover:text-zinc-400 cursor-pointer active:scale-75 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: `Check out this doodle by ${post.userName} on DoodleBoard!`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
            aria-label="Share"
            className="text-white hover:text-zinc-400 cursor-pointer active:scale-75 transition-transform"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>

        {/* Bookmark / Save */}
        <button
          type="button"
          onClick={() => setIsSaved(!isSaved)}
          aria-label="Save Post"
          className="text-white hover:text-zinc-400 cursor-pointer active:scale-75 transition-transform"
        >
          <Bookmark
            className={`w-6 h-6 transition-colors ${
              isSaved ? 'fill-white text-white' : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* 4. Likes count */}
      <div className="px-3.5 py-1">
        <span className="text-xs font-bold text-white">
          {(post.likes || 0) + (isLiked ? 1 : 0)} likes
        </span>
      </div>

      {/* 5. Title & Caption */}
      <div className="px-3.5 py-1 space-y-1">
        <p className="text-xs leading-relaxed text-zinc-100">
          <span
            onClick={handleUserClick}
            className="font-bold text-white mr-1.5 cursor-pointer hover:underline"
          >
            {post.userUsername || post.userName.toLowerCase().replace(/\s+/g, '_')}
          </span>
          <span className="font-medium text-zinc-200">{post.title}</span>
          {post.description && (
            <span className="block text-zinc-400 text-[11px] mt-0.5">
              {post.description}
            </span>
          )}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-[#0095f6] text-[11px] font-medium hover:underline cursor-pointer">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 6. Comments Preview */}
      {localComments.length > 0 && (
        <div className="px-3.5 py-1 space-y-0.5">
          {localComments.map((c) => (
            <div key={c.id} className="text-xs text-zinc-200">
              <span className="font-bold text-white mr-1.5">{c.user}</span>
              <span>{c.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* 7. Timestamp */}
      <div className="px-3.5 py-1.5">
        <time className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
          {formatTimestamp(post.timestamp)}
        </time>
      </div>

      {/* 8. Comment Input Row */}
      {showCommentInput && (
        <form
          onSubmit={handleAddComment}
          className="border-t border-neutral-900 px-3.5 py-2 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          {commentText.trim().length > 0 && (
            <button
              type="submit"
              className="text-xs font-bold text-[#0095f6] hover:text-[#1877f2] cursor-pointer"
            >
              Post
            </button>
          )}
        </form>
      )}
    </article>
  );
};
