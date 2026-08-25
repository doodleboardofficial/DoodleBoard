import React, { useEffect } from 'react';
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = post.src;
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
      // Ignore abort
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="fullscreen-modal-content"
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          id="close-fullscreen-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer border border-gray-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Big Image Display */}
        <div className="flex-1 bg-gray-100/90 flex items-center justify-center p-4 sm:p-8 min-h-[300px] md:min-h-[500px] relative overflow-hidden">
          <img
            src={post.src}
            alt={post.title}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-sm select-none"
            referrerPolicy="no-referrer"
          />

          {/* Quick Actions overlay on image */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <button
              onClick={handleDownload}
              id="fullscreen-download-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 hover:bg-white text-gray-900 rounded-full text-xs font-bold shadow-md backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handleShare}
              id="fullscreen-share-btn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 hover:bg-white text-gray-900 rounded-full text-xs font-bold shadow-md backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Right: Info & Metadata Column */}
        <div className="w-full md:w-80 lg:w-96 p-6 flex flex-col justify-between overflow-y-auto bg-white">
          <div className="space-y-5">
            
            {/* Top Bar inside panel: Like and Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  id="fullscreen-like-btn"
                  onClick={() => onLikeToggle(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-150 active:scale-95 cursor-pointer ${
                    isLiked
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-gray-700'}`} />
                  <span>{post.likes}</span>
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
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 leading-snug tracking-tight">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
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
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-gray-100" />

            {/* Creator Profile Section */}
            <div className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
              post.isOwner
                ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/50 shadow-sm'
                : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center p-[2px] shrink-0 ${
                    post.isOwner
                      ? 'bg-gradient-to-tr from-[#1D9BF0] via-[#60A5FA] to-[#0284C7] shadow-[0_0_12px_rgba(29,155,240,0.5)] ring-2 ring-white'
                      : ''
                  }`}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs border-2 border-white"
                    style={{ backgroundColor: post.userAvatarBg || '#000000' }}
                  >
                    {post.userAvatarLetter || post.userName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {post.userName}
                    </p>
                    <VerifiedBadge
                      is_verified={post.is_verified || post.isVerified}
                      is_owner={post.is_owner || post.isOwner}
                    />
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </p>
                </div>
              </div>

              {!isOwnPost && (
                <button
                  id="fullscreen-follow-btn"
                  onClick={() => onFollowToggle(post.userId)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-bold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-black text-white hover:bg-gray-800'
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
          <div className="pt-6 text-[11px] text-gray-400 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-[10px]">Esc</kbd> to close
          </div>
        </div>

      </div>
    </div>
  );
};
