import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Check,
  Heart,
  Grid,
  Sparkles,
  MapPin,
  Link as LinkIcon,
  MessageCircle,
  Bookmark,
  Send,
  UserCheck,
  UserPlus,
  LayoutGrid,
  Columns,
  Crown
} from 'lucide-react';
import { Post, User } from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import { useUserStore, StoredUser, formatFollowerCountReal } from '../store/userStore';

interface PublicProfileViewProps {
  user: StoredUser | User | any;
  currentUser: User | null;
  posts: Post[];
  likedPostIds: string[];
  followedUserIds: string[];
  onBack: () => void;
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
  onViewUserProfile?: (usernameOrId: string) => void;
  onEditOwnProfile?: () => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  user: initialUser,
  currentUser,
  posts,
  likedPostIds,
  followedUserIds,
  onBack,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
  onViewUserProfile,
  onEditOwnProfile,
}) => {
  const { users, toggleFollow } = useUserStore();

  // Find latest live user from Zustand store to ensure exact real-time numbers
  const liveUser = users.find(
    (u) =>
      u.id === initialUser.id ||
      u.username.toLowerCase() === (initialUser.username || '').replace(/^@/, '').toLowerCase() ||
      (initialUser.id?.includes('pranjali') && (u.username === 'pranjali' || u.owner))
  ) || initialUser;

  const [activeTab, setActiveTab] = useState<'doodles' | 'saved' | 'about'>('doodles');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const cleanUsername = (liveUser.username || '').replace(/^@/, '');
  const isOwnProfile =
    currentUser?.id === liveUser.id ||
    currentUser?.username?.toLowerCase() === cleanUsername.toLowerCase();
  
  const isFollowing = followedUserIds.includes(liveUser.id);
  const isOwner = Boolean(liveUser.owner || liveUser.isOwner || liveUser.is_owner);
  const isVerified = Boolean(liveUser.verified || liveUser.isVerified || liveUser.is_verified);

  // Filter posts created by this user
  const userDoodles = posts.filter(
    (p) =>
      p.userId === liveUser.id ||
      (p.userUsername && p.userUsername.toLowerCase() === cleanUsername.toLowerCase()) ||
      p.userName.toLowerCase() === liveUser.name?.toLowerCase()
  );

  // Exact real follower numbers from store
  const followersCount = liveUser.followers ?? 0;
  const followingCount = liveUser.following ?? 0;
  const avatarSrc = liveUser.avatar || liveUser.avatarImage;

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${cleanUsername}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${liveUser.name} (@${cleanUsername}) on DoodleBoard`,
          text: `Check out ${liveUser.name}'s sketches on DoodleBoard!`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      }
    } catch {
      // Ignore
    }
  };

  const handleFollowClick = () => {
    if (onFollowToggle) {
      onFollowToggle(liveUser.id);
    }
    toggleFollow(liveUser.id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowMessageModal(false);
      setMessageText('');
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6 pb-20 bg-black text-white min-h-screen">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
        <div className="flex items-center gap-3">
          <button
            id="back-to-feed-btn"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-zinc-300 transition-transform active:scale-95 cursor-pointer border border-neutral-800"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1">
              <span>@{cleanUsername}</span>
            </h1>
            <VerifiedBadge
              is_verified={isVerified}
              is_owner={isOwner}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="share-profile-btn"
            onClick={handleShareProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-zinc-200 border border-neutral-800 transition-all cursor-pointer"
            title="Share Profile Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Instagram Profile Header */}
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-4 sm:gap-8">
          
          {/* Large Avatar with Gradient Ring */}
          <div className="relative shrink-0">
            <div
              className={`rounded-full p-[3px] transition-transform ${
                isOwner
                  ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-md ring-2 ring-neutral-800'
                  : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] ring-2 ring-neutral-800'
              }`}
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-black p-[1px]">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={liveUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl select-none"
                    style={{ backgroundColor: liveUser.avatarColor || '#18181b' }}
                  >
                    {liveUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Owner Crown Tag */}
            {isOwner && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 border border-neutral-900 whitespace-nowrap">
                👑 OWNER
              </span>
            )}
          </div>

          {/* Right: Stats and Action Buttons */}
          <div className="flex-1 min-w-0 space-y-3 pt-1">
            
            {/* Stats Row */}
            <div className="flex items-center justify-around sm:justify-start sm:gap-10 text-center sm:text-left pt-1">
              <div className="cursor-pointer" onClick={() => setActiveTab('doodles')}>
                <span className="block font-bold text-white text-lg sm:text-xl leading-tight">
                  {userDoodles.length}
                </span>
                <span className="text-xs text-zinc-500 font-medium">posts</span>
              </div>
              <div
                className="cursor-pointer"
                onClick={handleFollowClick}
                title={`Exact Followers: ${followersCount.toLocaleString()}`}
              >
                <span className="block font-bold text-white text-lg sm:text-xl leading-tight">
                  {formatFollowerCountReal(followersCount)}
                </span>
                <span className="text-xs text-zinc-500 font-medium">followers</span>
              </div>
              <div title={`Exact Following: ${followingCount.toLocaleString()}`}>
                <span className="block font-bold text-white text-lg sm:text-xl leading-tight">
                  {formatFollowerCountReal(followingCount)}
                </span>
                <span className="text-xs text-zinc-500 font-medium">following</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 pt-2">
              {isOwnProfile ? (
                <>
                  {onEditOwnProfile && (
                    <button
                      onClick={onEditOwnProfile}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-zinc-200 border border-neutral-800 transition-colors cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  )}
                  <button
                    onClick={handleShareProfile}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-zinc-200 border border-neutral-800 transition-colors cursor-pointer"
                  >
                    Share Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    id={`profile-follow-toggle-${liveUser.id}`}
                    onClick={handleFollowClick}
                    className={`flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                      isFollowing
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-zinc-300'
                        : isOwner
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-xs font-bold'
                        : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-zinc-200 border border-neutral-800 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Bio & Details Section */}
        <div className="space-y-2 pt-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm font-bold text-white flex items-center gap-1">
                {liveUser.name}
              </h2>
              <VerifiedBadge
                is_verified={isVerified}
                is_owner={isOwner}
              />
            </div>

            {liveUser.category && (
              <span className="inline-block text-xs font-medium text-zinc-400">
                {liveUser.category}
              </span>
            )}
          </div>

          {/* Formatted Bio */}
          {liveUser.bio && (
            <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed max-w-xl">
              {liveUser.bio}
            </div>
          )}

          {/* Location & Website */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 pt-0.5">
            {liveUser.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-zinc-500" />
                <span>{liveUser.location}</span>
              </span>
            )}
            {liveUser.website && (
              <a
                href={`https://${liveUser.website.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#0095f6] hover:underline font-medium"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{liveUser.website}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-neutral-900 pt-3">
        <div className="flex justify-center gap-12">
          <button
            onClick={() => setActiveTab('doodles')}
            className={`flex items-center gap-2 pb-3 text-xs uppercase font-bold tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'doodles'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts ({userDoodles.length})</span>
          </button>
        </div>

        {/* 3-Column Square Grid */}
        <div className="pt-3">
          {userDoodles.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {userDoodles.map((post) => {
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackSrc;
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white">
                      <div className="flex items-center gap-1 text-xs font-bold">
                        <Heart className="w-4 h-4 fill-white" />
                        <span>{(post.likes || 0) + (isLiked ? 1 : 0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-neutral-950 rounded-2xl border border-neutral-900">
              <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto text-zinc-500">
                <Grid className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">No posts yet</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {liveUser.name} has not shared any drawings yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-950 text-white border border-neutral-900 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Send Direct Message to {liveUser.name}</h3>
            
            {messageSent ? (
              <div className="py-6 text-center text-emerald-400 flex flex-col items-center gap-2">
                <Check className="w-8 h-8 animate-bounce" />
                <p className="text-xs font-bold">Message sent!</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={3}
                  placeholder={`Write a message to ${liveUser.name}...`}
                  className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-neutral-700 resize-none"
                  required
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="px-3 py-1.5 bg-neutral-900 text-zinc-300 rounded-lg text-xs font-semibold hover:bg-neutral-800 border border-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
