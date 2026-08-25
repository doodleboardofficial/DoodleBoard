import React, { useState } from 'react';
import { Settings, Plus, Heart, Grid, Users, Edit3, Sparkles, RefreshCw, Database, LogOut, ShieldCheck, Mail } from 'lucide-react';
import { Post, User } from '../types';
import { MasonryGrid } from './MasonryGrid';
import { supabaseAuth, getSupabaseConfig } from '../services/supabase';
import { VerifiedBadge } from './VerifiedBadge';

interface ProfileTabProps {
  currentUser: User | null;
  posts: Post[];
  likedPostIds: string[];
  followedUserIds: string[];
  onUpdateUser: (updated: User) => void;
  onOpenUpload: () => void;
  onLikeToggle: (postId: string) => void;
  onFollowToggle: (userId: string) => void;
  onCardClick: (post: Post) => void;
  onResetDemoData: () => void;
  onOpenSupabaseSetup?: () => void;
  onSignOut?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentUser,
  posts,
  likedPostIds,
  followedUserIds,
  onUpdateUser,
  onOpenUpload,
  onLikeToggle,
  onFollowToggle,
  onCardClick,
  onResetDemoData,
  onOpenSupabaseSetup,
  onSignOut,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'uploads' | 'liked'>('uploads');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editColor, setEditColor] = useState(currentUser?.avatarColor || '#2563EB');

  const { isConfigured } = getSupabaseConfig();

  if (!currentUser) return null;

  // Filter user's uploaded drawings
  const userUploads = posts.filter((p) => p.userId === currentUser.id);

  // Filter user's liked drawings
  const likedPosts = posts.filter((p) => likedPostIds.includes(p.id));

  // Compute total likes received
  const totalLikesReceived = userUploads.reduce((sum, p) => sum + (p.likes || 0), 0);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated: User = {
      ...currentUser,
      name: editName.trim(),
      bio: editBio.trim(),
      avatarLetter: editName.trim().charAt(0).toUpperCase(),
      avatarColor: editColor,
    };

    // Update in Supabase profiles table if configured
    if (isConfigured) {
      await supabaseAuth.updateProfile(currentUser.id, editName.trim(), updated.avatarLetter);
    }

    onUpdateUser(updated);
    setIsEditing(false);
  };

  const AVATAR_COLOR_CHOICES = [
    '#2563EB', '#4F46E5', '#7C3AED', '#DB2777', 
    '#DC2626', '#D97706', '#059669', '#0891B2', '#1E293B'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Profile Header Card */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto pt-2">
        
        {/* Large Avatar */}
        <div className="relative">
          <div
            className={`rounded-full p-[3.5px] transition-transform ${
              currentUser.isOwner
                ? 'bg-gradient-to-tr from-[#1D9BF0] via-[#60A5FA] to-[#0284C7] shadow-[0_0_20px_rgba(29,155,240,0.55)] ring-4 ring-white'
                : 'ring-4 ring-neutral-100'
            }`}
          >
            {currentUser.avatarImage ? (
              <img
                src={currentUser.avatarImage}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-sm border-2 border-white"
              />
            ) : (
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white font-bold text-4xl sm:text-5xl shadow-md border-2 border-white select-none"
                style={{ backgroundColor: currentUser.avatarColor || '#2563EB' }}
              >
                {currentUser.avatarLetter || currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Name, Handle, and Bio */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {currentUser.name}
            </h1>
            <VerifiedBadge
              is_verified={currentUser.is_verified || currentUser.isVerified}
              is_owner={currentUser.is_owner || currentUser.isOwner}
            />
            {isConfigured && (
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="Supabase Synced">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium">
            <span>{currentUser.username}</span>
            {currentUser.email && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {currentUser.email}
                </span>
              </>
            )}
            {currentUser.isAnonymous && (
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                Guest / Anon
              </span>
            )}
          </div>

          {currentUser.bio && (
            <p className="text-sm text-neutral-600 max-w-sm pt-1">
              {currentUser.bio}
            </p>
          )}
        </div>

        {/* Stats Strip: Uploads, Following, Likes */}
        <div className="flex items-center justify-center gap-8 pt-2 text-sm">
          <div className="text-center">
            <span className="block font-bold text-gray-900 text-xl tracking-tight">
              {userUploads.length}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pins</span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="text-center">
            <span className="block font-bold text-gray-900 text-xl tracking-tight">
              {followedUserIds.length}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Following</span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="text-center">
            <span className="block font-bold text-gray-900 text-xl tracking-tight">
              {totalLikesReceived}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Likes</span>
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            id="edit-profile-btn"
            onClick={() => {
              setEditName(currentUser.name);
              setEditBio(currentUser.bio || '');
              setEditColor(currentUser.avatarColor);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          
          <button
            id="profile-upload-btn"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-bold transition-transform active:scale-95 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New</span>
          </button>

          {onOpenSupabaseSetup && (
            <button
              id="profile-supabase-btn"
              onClick={onOpenSupabaseSetup}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
              title="Supabase Schema & Settings"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Backend</span>
            </button>
          )}

          {onSignOut && (
            <button
              id="profile-signout-btn"
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full text-xs font-bold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

      </div>

      {/* Sub-Tabs: Uploads vs Saved/Liked */}
      <div className="flex items-center justify-center gap-4 border-b border-gray-100 pt-4">
        <button
          id="profile-tab-uploads"
          onClick={() => setActiveSubTab('uploads')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'uploads'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>My Uploads ({userUploads.length})</span>
        </button>

        <button
          id="profile-tab-liked"
          onClick={() => setActiveSubTab('liked')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'liked'
              ? 'border-black text-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked Doodles ({likedPosts.length})</span>
        </button>
      </div>

      {/* Content Grid */}
      {activeSubTab === 'uploads' ? (
        userUploads.length > 0 ? (
          <MasonryGrid
            posts={userUploads}
            currentUser={currentUser}
            likedPostIds={likedPostIds}
            followedUserIds={followedUserIds}
            onLikeToggle={onLikeToggle}
            onFollowToggle={onFollowToggle}
            onCardClick={onCardClick}
          />
        ) : (
          <div className="py-16 text-center space-y-4 bg-gray-50 rounded-3xl border border-gray-100 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-gray-200/80 flex items-center justify-center mx-auto text-gray-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">
                You haven't uploaded any drawings yet
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Share your first doodle from your phone gallery or draw one on the sketch pad!
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="px-5 py-2.5 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-transform active:scale-95 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Doodle</span>
            </button>
          </div>
        )
      ) : (
        likedPosts.length > 0 ? (
          <MasonryGrid
            posts={likedPosts}
            currentUser={currentUser}
            likedPostIds={likedPostIds}
            followedUserIds={followedUserIds}
            onLikeToggle={onLikeToggle}
            onFollowToggle={onFollowToggle}
            onCardClick={onCardClick}
          />
        ) : (
          <div className="py-16 text-center space-y-3 bg-gray-50 rounded-3xl border border-gray-100 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No liked drawings yet
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Tap the heart icon on any doodle in the feed to save it to your collection.
            </p>
          </div>
        )
      )}

      {/* Footer Utility / Reset Demo Data */}
      <div className="pt-10 pb-4 text-center border-t border-gray-100">
        <button
          onClick={() => {
            if (confirm('Reset DoodleBoard sample drawings and follows?')) {
              onResetDemoData();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset to Default Starter Feed</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md border border-gray-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900">
              Edit Your Profile
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">
                  Bio
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a bit about what you love to draw..."
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Avatar Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLOR_CHOICES.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setEditColor(col)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        editColor === col ? 'scale-115 ring-2 ring-black ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold text-white bg-black hover:bg-gray-800 cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
