import React from 'react';
import { Home, Search, PlusSquare, Heart, User as UserIcon } from 'lucide-react';
import { TabType, User } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenUpload: () => void;
  currentUser: User | null;
  unreadActivity?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  currentUser,
  unreadActivity = false,
}) => {
  return (
    <nav
      id="instagram-bottom-nav"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-neutral-900 px-4 py-2 flex items-center justify-around select-none"
    >
      {/* 1. Home Tab */}
      <button
        id="bottom-nav-home"
        type="button"
        onClick={() => setActiveTab('home')}
        aria-label="Home"
        className={`p-2 transition-transform active:scale-75 cursor-pointer ${
          activeTab === 'home' ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Home className={`w-6 h-6 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      {/* 2. Search / Explore Tab */}
      <button
        id="bottom-nav-search"
        type="button"
        onClick={() => setActiveTab('search')}
        aria-label="Search and Explore"
        className={`p-2 transition-transform active:scale-75 cursor-pointer ${
          activeTab === 'search' ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Search className={`w-6 h-6 ${activeTab === 'search' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
      </button>

      {/* 3. Create / PlusSquare */}
      <button
        id="bottom-nav-create"
        type="button"
        onClick={onOpenUpload}
        aria-label="Create New Post"
        className="p-2 text-zinc-400 hover:text-white transition-transform active:scale-75 cursor-pointer"
      >
        <PlusSquare className="w-6 h-6 stroke-[1.8]" />
      </button>

      {/* 4. Activity / Heart Tab */}
      <button
        id="bottom-nav-activity"
        type="button"
        onClick={() => setActiveTab('activity')}
        aria-label="Activity and Notifications"
        className={`p-2 relative transition-transform active:scale-75 cursor-pointer ${
          activeTab === 'activity' ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Heart
          className={`w-6 h-6 ${
            activeTab === 'activity'
              ? 'fill-white stroke-white'
              : 'stroke-[1.8]'
          }`}
        />
        {unreadActivity && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff3040] ring-2 ring-black" />
        )}
      </button>

      {/* 5. Profile Tab */}
      <button
        id="bottom-nav-profile"
        type="button"
        onClick={() => setActiveTab('profile')}
        aria-label="Profile"
        className="p-2 transition-transform active:scale-75 cursor-pointer"
      >
        <div
          className={`w-6 h-6 rounded-full overflow-hidden p-[1px] transition-all ${
            activeTab === 'profile'
              ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
              : 'opacity-80 hover:opacity-100'
          }`}
        >
          {currentUser?.avatarImage ? (
            <img
              src={currentUser.avatarImage}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: currentUser?.avatarColor || '#3f3f46' }}
            >
              {currentUser?.avatarLetter || 'U'}
            </div>
          )}
        </div>
      </button>
    </nav>
  );
};
