import React, { useState, useEffect } from 'react';
import { X, Heart, Download, Share2, Check, Trash2, Calendar, UserCheck, UserPlus } from 'lucide-react';
import { Post, User } from '../types';
import { VerifiedBadge } from './VerifiedBadge';

interface FullscreenViewerProps {
  post: Post | null;
  currentUser: User | null;
  likedPostIds: string[];
  followedUserIds: string[];
  onClose: () => void;
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onDeletePost?: (postId: string) => void;
  onViewUserProfile?: (usernameOrId: string) => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  post,
  currentUser,
  likedPostIds,
  followedUserIds,
  onClose,
  onLikeToggle,
  onFollowToggle,
  onDeletePost,
  onViewUserProfile,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!post) return null;

  const isLiked = likedPostIds.includes(post.id);
  const isFollowing = followedUserIds.includes(post.userId);
  const isOwnPost = currentUser?.id === post.userId;

  const [imgError, setImgError] = useState(false);
  const FALLBACK_DOODLE_IMG = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80';
  const displaySrc = imgError ? FALLBACK_DOODLE_IMG : (post.imageUrl || post.src || post.image_url || FALLBACK_DOODLE_IMG);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = displaySrc;
    link.download = `${post.title.toLowerCase().replace(/\s+/g, '_')}_doodle.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${post.title} on DoodleBoard`,
          text: `Check out this doodle by ${post.userName}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore
    }
  };

  const formattedDate = new Date(post.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id="fullscreen-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="fullscreen-modal-content"
        className="relative bg-black w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto border border-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          id="close-fullscreen-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-zinc-300 flex items-center justify-center border border-neutral-800 transition-all active:scale-95 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Aspect Square or Fitted Image Display */}
        <div className="flex-1 bg-neutral-950 flex items-center justify-center p-4 sm:p-8 min-h-[300px] md:min-h-[500px] relative overflow-hidden">
          <img
            src={displaySrc}
            alt={post.title}
            onError={() => setImgError(true)}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none"
            referrerPolicy="no-referrer"
          />

          {/* Quick Actions overlay on image */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <button
              onClick={handleDownload}
              id="fullscreen-download-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 hover:bg-black text-white rounded-lg text-xs font-semibold border border-neutral-800 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handleShare}
              id="fullscreen-share-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 hover:bg-black text-white rounded-lg text-xs font-semibold border border-neutral-800 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Right: Info & Metadata Column */}
        <div className="w-full md:w-80 lg:w-96 p-6 flex flex-col justify-between overflow-y-auto bg-black border-t md:border-t-0 md:border-l border-neutral-900 text-white">
          <div className="space-y-5">
            
            {/* Top Bar inside panel: Like and Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  id="fullscreen-like-btn"
                  onClick={() => onLikeToggle(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-150 active:scale-95 cursor-pointer ${
                    isLiked
                      ? 'bg-[#ff3040] text-white shadow-xs'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-zinc-300'}`} />
                  <span>{(post.likes || 0) + (isLiked ? 1 : 0)} likes</span>
                </button>
              </div>

              {/* Delete button if own post */}
              {isOwnPost && onDeletePost && (
                <button
                  id="fullscreen-delete-btn"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this doodle?')) {
                      onDeletePost(post.id);
                      onClose();
                    }
                  }}
                  className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white leading-snug tracking-tight">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {post.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-zinc-300 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-neutral-900" />

            {/* Creator Profile Section */}
            <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
              post.isOwner
                ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30'
                : 'bg-neutral-900/80 border-neutral-800'
            }`}>
              <div
                onClick={() => {
                  if (onViewUserProfile) {
                    onClose();
                    onViewUserProfile(post.userUsername || post.userId || post.userName);
                  }
                }}
                className="flex items-center gap-3 min-w-0 cursor-pointer group/user"
                title={`View ${post.userName}'s profile`}
              >
                <div
                  className={`w-10 h-10 rounded-full p-[2px] shrink-0 transition-transform group-hover/user:scale-105 ${
                    post.isOwner
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-500'
                      : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-black p-[1px]">
                    {post.userAvatarImage ? (
                      <img
                        src={post.userAvatarImage}
                        alt={post.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: post.userAvatarBg || '#18181b' }}
                      >
                        {post.userAvatarLetter || post.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <p className="text-xs font-bold text-white truncate group-hover/user:underline">
                      {post.userName}
                    </p>
                    <VerifiedBadge
                      is_verified={post.is_verified || post.isVerified}
                      is_owner={post.is_owner || post.isOwner}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </p>
                </div>
              </div>

              {!isOwnPost && (
                <button
                  id="fullscreen-follow-btn"
                  onClick={() => onFollowToggle(post.userId)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isFollowing
                      ? 'bg-neutral-800 text-zinc-300 hover:bg-neutral-700'
                      : 'bg-[#0095f6] text-white hover:bg-[#1877f2]'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

          {/* Bottom helper info */}
          <div className="pt-6 text-[10px] text-zinc-600 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-zinc-400 font-mono">Esc</kbd> to close
          </div>
        </div>

      </div>
    </div>
  );
};
