import React, { useState } from 'react';
import { Settings, Plus, Heart, Grid, Users, Edit3, Sparkles, RefreshCw, Database, LogOut, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';
import { Post, User } from '../types';
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
  onOpenAdmin?: () => void;
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
  onOpenAdmin,
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
    '#DC2626', '#D97706', '#059669', '#0891B2', '#18181b'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-white min-h-screen bg-black pb-20">
      
      {/* Profile Header Card */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-md mx-auto pt-2">
        
        {/* Large Avatar with Instagram Gradient Ring */}
        <div className="relative">
          <div
            className={`rounded-full p-[3px] transition-transform ${
              currentUser.isOwner
                ? 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 shadow-md ring-2 ring-neutral-800'
                : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] ring-2 ring-neutral-800'
            }`}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-black p-[2px]">
              {currentUser.avatarImage ? (
                <img
                  src={currentUser.avatarImage}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl select-none"
                  style={{ backgroundColor: currentUser.avatarColor || '#18181b' }}
                >
                  {currentUser.avatarLetter || currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name, Handle, and Bio */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentUser.name}
            </h1>
            <VerifiedBadge
              is_verified={currentUser.is_verified || currentUser.isVerified}
              is_owner={currentUser.is_owner || currentUser.isOwner}
            />
            {isConfigured && (
              <span className="p-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800" title="Supabase Synced">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-medium">
            <span>@{currentUser.username || currentUser.name.toLowerCase().replace(/\s+/g, '_')}</span>
            {currentUser.email && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Mail className="w-3 h-3" />
                  {currentUser.email}
                </span>
              </>
            )}
          </div>

          {currentUser.bio && (
            <p className="text-xs text-zinc-300 max-w-sm pt-1 leading-relaxed">
              {currentUser.bio}
            </p>
          )}
        </div>

        {/* Stats Strip: Posts, Following, Likes */}
        <div className="flex items-center justify-center gap-8 pt-2 text-sm">
          <div className="text-center">
            <span className="block font-bold text-white text-lg tracking-tight">
              {userUploads.length}
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Posts</span>
          </div>
          <div className="h-6 w-px bg-neutral-900" />
          <div className="text-center">
            <span className="block font-bold text-white text-lg tracking-tight">
              {followedUserIds.length}
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Following</span>
          </div>
          <div className="h-6 w-px bg-neutral-900" />
          <div className="text-center">
            <span className="block font-bold text-white text-lg tracking-tight">
              {totalLikesReceived}
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Likes</span>
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
            className="flex items-center gap-1.5 px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-zinc-200 border border-neutral-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          
          <button
            id="profile-upload-btn"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </button>

          {onOpenAdmin && (
            <button
              id="profile-god-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-amber-800/60"
              title="God Admin Panel (/admin-pranjali-777)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>God Admin</span>
            </button>
          )}

          {onSignOut && (
            <button
              id="profile-signout-btn"
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-red-400 hover:bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-950 text-white border border-neutral-900 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Edit Profile</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Avatar Color</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLOR_CHOICES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      className={`w-6 h-6 rounded-full border border-neutral-700 ${
                        editColor === c ? 'ring-2 ring-white ring-offset-1 ring-offset-black' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-neutral-900 text-zinc-300 rounded-lg text-xs font-semibold hover:bg-neutral-800 border border-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Tabs: Uploads vs Liked */}
      <div className="border-t border-neutral-900 pt-3">
        <div className="flex justify-center gap-12">
          <button
            onClick={() => setActiveSubTab('uploads')}
            className={`flex items-center gap-2 pb-3 text-xs uppercase font-bold tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeSubTab === 'uploads'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts ({userUploads.length})</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('liked')}
            className={`flex items-center gap-2 pb-3 text-xs uppercase font-bold tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeSubTab === 'liked'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved & Liked ({likedPosts.length})</span>
          </button>
        </div>

        {/* 3-Column Square Grid */}
        <div className="pt-3">
          {(activeSubTab === 'uploads' ? userUploads : likedPosts).length > 0 ? (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {(activeSubTab === 'uploads' ? userUploads : likedPosts).map((post) => {
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
                {activeSubTab === 'uploads' ? <Grid className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
              </div>
              <h3 className="text-sm font-bold text-white">
                {activeSubTab === 'uploads' ? 'No posts yet' : 'No liked posts yet'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                {activeSubTab === 'uploads'
                  ? 'Start your doodle journey by creating and sharing your drawings.'
                  : 'Double tap any post in the feed or explore tab to add it here.'}
              </p>
              {activeSubTab === 'uploads' && (
                <button
                  onClick={onOpenUpload}
                  className="mt-2 px-4 py-2 bg-[#0095f6] text-white rounded-lg text-xs font-bold hover:bg-[#1877f2] transition-colors cursor-pointer"
                >
                  Create First Post
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
