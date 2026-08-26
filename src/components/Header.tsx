import React from 'react';
import { Heart, Send, PlusSquare, Search, Compass } from 'lucide-react';
import { User, TabType } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenUpload: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenSupabaseSetup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenUpload,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-neutral-900 transition-all duration-200">
      <div className="max-w-[975px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Instagram / DoodleBoard Logo */}
        <button
          id="doodleboard-logo-btn"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-white font-serif italic select-none">
            DoodleBoard
          </span>
        </button>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <div className="hidden sm:block flex-1 max-w-xs mx-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Search doodles or artists..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'search' && e.target.value.trim().length > 0) {
                  setActiveTab('search');
                }
              }}
              onFocus={() => {
                if (activeTab !== 'search') {
                  setActiveTab('search');
                }
              }}
              className="block w-full pl-10 pr-3.5 py-1.5 bg-neutral-900 text-xs text-white placeholder-zinc-500 rounded-lg border border-neutral-800 focus:border-neutral-700 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Actions: Create, Activity, DM icons */}
        <div className="flex items-center gap-3.5 sm:gap-4 text-white">
          {/* Create Button (Desktop) */}
          <button
            type="button"
            onClick={onOpenUpload}
            aria-label="Create Post"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-white cursor-pointer active:scale-95 transition-all"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Create</span>
          </button>

          {/* Activity / Heart Icon */}
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            aria-label="Notifications"
            className="text-white hover:text-zinc-400 transition-transform active:scale-75 cursor-pointer p-1"
          >
            <Heart className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Direct Message Icon */}
          <button
            type="button"
            onClick={() => {
              // Direct messages quick alert or indicator
              setActiveTab('activity');
            }}
            aria-label="Messages"
            className="text-white hover:text-zinc-400 transition-transform active:scale-75 cursor-pointer p-1 relative"
          >
            <Send className="w-6 h-6 stroke-[1.8]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0095f6]" />
          </button>

          {/* Desktop User Avatar */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            aria-label="Your Profile"
            className="hidden sm:block cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-neutral-700">
              {currentUser?.avatarImage ? (
                <img
                  src={currentUser.avatarImage}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: currentUser?.avatarColor || '#27272a' }}
                >
                  {currentUser?.avatarLetter || 'U'}
                </div>
              )}
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
