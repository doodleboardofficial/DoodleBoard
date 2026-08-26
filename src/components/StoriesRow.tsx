import React, { useState, useEffect } from 'react';
import { Plus, X, Heart, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { User, Post } from '../types';

export interface StoryItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userAvatarBg?: string;
  userAvatarLetter?: string;
  isOwner?: boolean;
  isVerified?: boolean;
  hasUnseenStory: boolean;
  storyImage: string;
  storyCaption: string;
  timeAgo: string;
}

interface StoriesRowProps {
  currentUser: User | null;
  posts: Post[];
  onOpenUpload: () => void;
  onViewUserProfile?: (usernameOrId: string) => void;
}

const DEFAULT_STORIES: StoryItem[] = [
  {
    id: 'story-1',
    userId: 'artist-sarah',
    userName: 'sarah_lines',
    userAvatarBg: '#e11d48',
    userAvatarLetter: 'S',
    hasUnseenStory: true,
    storyImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=80',
    storyCaption: 'Late night line art study 🌙✨',
    timeAgo: '2h',
  },
  {
    id: 'story-2',
    userId: 'artist-leo',
    userName: 'leo_draws',
    userAvatarBg: '#2563eb',
    userAvatarLetter: 'L',
    isVerified: true,
    hasUnseenStory: true,
    storyImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80',
    storyCaption: 'Botanical ink exploration 🌿',
    timeAgo: '4h',
  },
  {
    id: 'story-3',
    userId: 'artist-maya',
    userName: 'maya_doodles',
    userAvatarBg: '#7c3aed',
    userAvatarLetter: 'M',
    hasUnseenStory: true,
    storyImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop&q=80',
    storyCaption: 'Chibi character design warmup! 🐱',
    timeAgo: '5h',
  },
  {
    id: 'story-4',
    userId: 'artist-kai',
    userName: 'kai_sketches',
    userAvatarBg: '#059669',
    userAvatarLetter: 'K',
    hasUnseenStory: true,
    storyImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&auto=format&fit=crop&q=80',
    storyCaption: 'Cyberpunk geometric doodle ⚡',
    timeAgo: '7h',
  },
  {
    id: 'story-5',
    userId: 'artist-elena',
    userName: 'elena_art',
    userAvatarBg: '#d97706',
    userAvatarLetter: 'E',
    isVerified: true,
    hasUnseenStory: true,
    storyImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
    storyCaption: 'Fluid minimalist abstract flow 🌊',
    timeAgo: '11h',
  },
  {
    id: 'story-6',
    userId: 'artist-sam',
    userName: 'sam_ink',
    userAvatarBg: '#0891b2',
    userAvatarLetter: 'S',
    hasUnseenStory: true,
    storyImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&auto=format&fit=crop&q=80',
    storyCaption: 'Coffee cup continuous line drawing ☕',
    timeAgo: '14h',
  },
];

export const StoriesRow: React.FC<StoriesRowProps> = ({
  currentUser,
  posts,
  onOpenUpload,
  onViewUserProfile,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [storyLiked, setStoryLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [viewedStories, setViewedStories] = useState<Record<string, boolean>>({});

  // Blend any dynamic posts from artists as available stories
  const storiesList: StoryItem[] = React.useMemo(() => {
    const list = [...DEFAULT_STORIES];
    // If posts exist, extract a couple of real creator stories
    if (posts && posts.length > 0) {
      posts.slice(0, 4).forEach((p, idx) => {
        if (!list.some((s) => s.userId === p.userId)) {
          list.push({
            id: `post-story-${p.id}`,
            userId: p.userId,
            userName: p.userUsername || p.userName.toLowerCase().replace(/\s+/g, '_'),
            userAvatar: p.userAvatarImage,
            userAvatarBg: p.userAvatarBg,
            userAvatarLetter: p.userAvatarLetter,
            isOwner: p.isOwner,
            isVerified: p.isVerified,
            hasUnseenStory: true,
            storyImage: p.imageUrl || p.src || DEFAULT_STORIES[0].storyImage,
            storyCaption: p.title || 'Fresh sketch on DoodleBoard ✨',
            timeAgo: `${(idx + 1) * 3}h`,
          });
        }
      });
    }
    return list;
  }, [posts]);

  const [showStoryHeartBurst, setShowStoryHeartBurst] = useState(false);

  // Keyboard navigation for Story viewer
  useEffect(() => {
    if (activeStoryIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStory();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        nextStory();
      } else if (e.key === 'ArrowLeft') {
        prevStory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIndex, storiesList.length]);

  // Story Progress Timer
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          // Go to next story or close
          if (activeStoryIndex < storiesList.length - 1) {
            const nextIdx = activeStoryIndex + 1;
            setViewedStories((v) => ({ ...v, [storiesList[nextIdx].id]: true }));
            setActiveStoryIndex(nextIdx);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2; // ~5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, isPaused, storiesList.length]);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    setStoryLiked(false);
    setShowStoryHeartBurst(false);
    setReplyText('');
    setViewedStories((v) => ({ ...v, [storiesList[index].id]: true }));
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setStoryProgress(0);
    setShowStoryHeartBurst(false);
  };

  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < storiesList.length - 1) {
      const nextIdx = activeStoryIndex + 1;
      setViewedStories((v) => ({ ...v, [storiesList[nextIdx].id]: true }));
      setActiveStoryIndex(nextIdx);
      setStoryProgress(0);
      setStoryLiked(false);
      setShowStoryHeartBurst(false);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
      setStoryLiked(false);
      setShowStoryHeartBurst(false);
    }
  };

  const handleStoryLikeToggle = () => {
    setStoryLiked(!storyLiked);
    if (!storyLiked) {
      setShowStoryHeartBurst(true);
      setTimeout(() => setShowStoryHeartBurst(false), 900);
    }
  };

  const activeStory = activeStoryIndex !== null ? storiesList[activeStoryIndex] : null;

  return (
    <>
      {/* Horizontal Stories Carousel */}
      <div className="w-full bg-black border-b border-neutral-900 py-3.5 px-3 sm:px-4">
        <div className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          
          {/* Item 1: "Your Story" with plus badge */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 select-none cursor-pointer group">
            <div
              onClick={onOpenUpload}
              className="relative w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full p-[2px] bg-neutral-800 transition-transform active:scale-95 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-black flex items-center justify-center">
                {currentUser?.avatarImage ? (
                  <img
                    src={currentUser.avatarImage}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-base font-bold"
                    style={{ backgroundColor: currentUser?.avatarColor || '#262626' }}
                  >
                    {currentUser?.avatarLetter || 'You'}
                  </div>
                )}
              </div>

              {/* Blue Plus Icon Badge */}
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0095f6] border-2 border-black flex items-center justify-center text-white shadow-md">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] font-normal text-zinc-300 max-w-[68px] truncate text-center group-hover:text-white transition-colors">
              Your story
            </span>
          </div>

          {/* Creators Stories with vibrant Instagram gradient ring */}
          {storiesList.map((story, index) => {
            const isViewed = viewedStories[story.id];
            return (
              <div
                key={story.id}
                onClick={() => openStory(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 select-none cursor-pointer group"
              >
                {/* Gradient Ring Wrapper */}
                <div
                  className={`w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 active:scale-95 ${
                    isViewed
                      ? 'bg-neutral-700'
                      : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-sm'
                  }`}
                >
                  {/* Black border gap between ring and avatar */}
                  <div className="w-full h-full rounded-full p-[2px] bg-black">
                    <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
                      {story.userAvatar ? (
                        <img
                          src={story.userAvatar}
                          alt={story.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: story.userAvatarBg || '#3b82f6' }}
                        >
                          {story.userAvatarLetter || story.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Username */}
                <span className="text-[11px] font-normal text-zinc-300 max-w-[68px] truncate text-center group-hover:text-white transition-colors">
                  {story.userName}
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* Instagram Story Fullscreen Modal Viewer */}
      {activeStory && (
        <div
          id="instagram-story-viewer-modal"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Close Story Button */}
          <button
            onClick={closeStory}
            aria-label="Close Story"
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md cursor-pointer transition-transform active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav Controls */}
          {activeStoryIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevStory();
              }}
              aria-label="Previous Story"
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 items-center justify-center cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {activeStoryIndex < storiesList.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextStory();
              }}
              aria-label="Next Story"
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 items-center justify-center cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Story Container Card */}
          <div className="relative w-full h-full sm:h-[88vh] sm:max-w-md bg-neutral-950 sm:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl border border-neutral-900">
            
            {/* Story Top Header with Progress Bars & User Info */}
            <div className="absolute top-0 inset-x-0 z-30 p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-2.5">
              {/* Progress Bar */}
              <div className="w-full flex items-center gap-1.5 h-1">
                {storiesList.map((st, i) => (
                  <div key={st.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                      style={{
                        width:
                          i < (activeStoryIndex ?? 0)
                            ? '100%'
                            : i === activeStoryIndex
                            ? `${storyProgress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Creator Info */}
              <div className="flex items-center justify-between">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    closeStory();
                    if (onViewUserProfile) onViewUserProfile(activeStory.userName || activeStory.userId);
                  }}
                  className="flex items-center gap-2 cursor-pointer group/creator"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-white/40 flex items-center justify-center">
                    {activeStory.userAvatar ? (
                      <img
                        src={activeStory.userAvatar}
                        alt={activeStory.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: activeStory.userAvatarBg || '#000' }}
                      >
                        {activeStory.userAvatarLetter || activeStory.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover/creator:underline">
                      {activeStory.userName}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      • {activeStory.timeAgo}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-zinc-400 pr-10 sm:pr-2">
                  Doodle Story
                </div>
              </div>
            </div>

            {/* Main Story Image */}
            <div
              className="w-full h-full flex items-center justify-center bg-black relative"
              onDoubleClick={handleStoryLikeToggle}
            >
              <img
                src={activeStory.storyImage}
                alt={activeStory.storyCaption}
                className="w-full h-full object-contain select-none"
                referrerPolicy="no-referrer"
              />

              {/* Heart burst on story like */}
              {showStoryHeartBurst && (
                <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                  <div className="animate-ig-heart">
                    <Heart className="w-24 h-24 fill-white text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.85)] filter" />
                  </div>
                </div>
              )}

              {/* Left/Right Tap Area to advance */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  prevStory();
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  nextStory();
                }}
              />
            </div>

            {/* Story Bottom Reply Bar */}
            <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2">
              {activeStory.storyCaption && (
                <p className="text-sm font-medium text-white px-1 drop-shadow-md">
                  {activeStory.storyCaption}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Reply to ${activeStory.userName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && replyText.trim()) {
                        setReplyText('');
                        setStoryLiked(true);
                      }
                    }}
                    className="w-full bg-neutral-900/80 border border-neutral-700 text-white placeholder-zinc-400 text-xs px-4 py-2.5 rounded-full focus:outline-none focus:border-white transition-all backdrop-blur-md"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStoryLikeToggle}
                  aria-label="Like story"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-900/80 hover:bg-neutral-800 text-white cursor-pointer active:scale-90 transition-transform backdrop-blur-md"
                >
                  <Heart
                    className={`w-5 h-5 ${storyLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                  />
                </button>

                {replyText.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyText('');
                      setStoryLiked(true);
                    }}
                    aria-label="Send reply"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0095f6] hover:bg-[#1877f2] text-white cursor-pointer active:scale-90 transition-transform shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
