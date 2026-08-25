import React from 'react';
import { Home, Search, Plus, User as UserIcon } from 'lucide-react';
import { TabType, User } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenUpload: () => void;
  currentUser: User | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  currentUser,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-6 py-2 flex items-center justify-around shadow-lg">
      
      {/* Home Tab */}
      <button
        id="bottom-nav-home"
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
          activeTab === 'home'
            ? 'text-black font-bold'
            : 'text-gray-400 hover:text-gray-900 font-medium'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Search Tab */}
      <button
        id="bottom-nav-search"
        onClick={() => setActiveTab('search')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
          activeTab === 'search'
            ? 'text-black font-bold'
            : 'text-gray-400 hover:text-gray-900 font-medium'
        }`}
      >
        <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px]">Search</span>
      </button>

      {/* Center + Upload Button */}
      <button
        id="bottom-nav-add"
        onClick={onOpenUpload}
        aria-label="Upload New Doodle"
        className="w-12 h-12 -mt-5 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer ring-4 ring-white"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Profile Tab */}
      <button
        id="bottom-nav-profile"
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
          activeTab === 'profile'
            ? 'text-black font-bold'
            : 'text-gray-400 hover:text-gray-900 font-medium'
        }`}
      >
        {currentUser?.avatarImage ? (
          <img
            src={currentUser.avatarImage}
            alt={currentUser.name}
            className={`w-5 h-5 rounded-full object-cover ${
              activeTab === 'profile' ? 'ring-2 ring-black' : ''
            }`}
          />
        ) : (
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
              activeTab === 'profile' ? 'ring-2 ring-black' : ''
            }`}
            style={{ backgroundColor: currentUser?.avatarColor || '#000000' }}
          >
            {currentUser?.avatarLetter || 'JD'}
          </div>
        )}
        <span className="text-[10px]">Profile</span>
      </button>

    </div>
  );
};
