import React from 'react';
import { Search, Plus, Compass, Database } from 'lucide-react';
import { User, TabType } from '../types';
import { getSupabaseConfig } from '../services/supabase';
import { VerifiedBadge } from './VerifiedBadge';

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
  onOpenSupabaseSetup,
}) => {
  const { isConfigured } = getSupabaseConfig();
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <button
          id="doodleboard-logo-btn"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none rounded-xl"
        >
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0">
            <span className="text-white font-bold text-lg leading-none">D</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-red-600 select-none">
            DoodleBoard
          </h1>
        </button>

        {/* Desktop Quick Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 ml-2">
          <button
            id="nav-home-desktop"
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
              activeTab === 'home'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            Home
          </button>
          <button
            id="nav-search-desktop"
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
              activeTab === 'search'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            Explore
          </button>
        </nav>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-4 hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Search for inspiration, drawings, or creators..."
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
              className="block w-full pl-11 pr-4 py-2 bg-gray-100 hover:bg-gray-200/70 focus:bg-white text-sm text-gray-900 rounded-full border border-transparent focus:border-gray-200 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase backend status indicator button */}
          {onOpenSupabaseSetup && (
            <button
              id="header-supabase-btn"
              onClick={onOpenSupabaseSetup}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
              title="Supabase Backend Config & SQL Schema"
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">
                {isConfigured ? 'Supabase Connected' : 'Supabase Setup'}
              </span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>
          )}

          {/* Create / Upload button (Desktop) */}
          <button
            id="header-create-btn"
            onClick={onOpenUpload}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full text-sm font-bold transition-transform duration-150 active:scale-95 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload</span>
          </button>

          {/* User Profile avatar */}
          <button
            id="header-profile-btn"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 p-1 rounded-full transition-all duration-150 cursor-pointer ${
              activeTab === 'profile'
                ? 'ring-2 ring-black bg-gray-100'
                : 'hover:bg-gray-100'
            }`}
            title={currentUser ? currentUser.name : 'Profile'}
          >
            <div
              className={`rounded-full p-[1.5px] transition-transform ${
                currentUser?.isOwner
                  ? 'bg-gradient-to-tr from-[#1D9BF0] via-[#60A5FA] to-[#0284C7] shadow-[0_0_8px_rgba(29,155,240,0.5)] ring-1 ring-white'
                  : ''
              }`}
            >
              {currentUser?.avatarImage ? (
                <img
                  src={currentUser.avatarImage}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white"
                  style={{ backgroundColor: currentUser?.avatarColor || '#000000' }}
                >
                  {currentUser?.avatarLetter || 'JD'}
                </div>
              )}
            </div>
            <span className="hidden lg:flex items-center gap-0.5 text-xs font-semibold text-gray-800 max-w-[140px] truncate pr-1">
              <span className="truncate">{currentUser?.name || 'Profile'}</span>
              {currentUser && (
                <VerifiedBadge
                  is_verified={currentUser.is_verified || currentUser.isVerified}
                  is_owner={currentUser.is_owner || currentUser.isOwner}
                />
              )}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
