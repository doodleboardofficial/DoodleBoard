/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Post, TabType } from './types';
import {
  getStoredUser,
  saveStoredUser,
  getStoredPosts,
  saveStoredPosts,
  getStoredFollows,
  saveStoredFollows,
  getStoredLikes,
  saveStoredLikes,
  createNewUser,
  resetToDemoData,
} from './services/storage';

import { supabaseAuth, supabaseDb, getSupabaseConfig } from './services/supabase';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { SearchTab } from './components/SearchTab';
import { ProfileTab } from './components/ProfileTab';
import { BottomNav } from './components/BottomNav';
import { FullscreenViewer } from './components/FullscreenViewer';
import { UploadModal } from './components/UploadModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data from Supabase / localStorage on mount
  useEffect(() => {
    async function initApp() {
      try {
        const { isConfigured } = getSupabaseConfig();

        // 1. Resolve Current User
        let user: User | null = null;
        if (isConfigured) {
          user = await supabaseAuth.getCurrentUser();
        }
        if (!user) {
          user = getStoredUser();
        }

        // 2. Resolve Posts
        let initialPosts: Post[] = [];
        if (isConfigured) {
          initialPosts = await supabaseDb.fetchPosts();
        }

        if (!initialPosts || initialPosts.length === 0) {
          initialPosts = getStoredPosts();
        }

        setPosts(initialPosts);

        // 3. Resolve Likes and Follows for active user
        if (user) {
          setCurrentUser(user);
          saveStoredUser(user);

          if (isConfigured) {
            const [userLikes, userFollows] = await Promise.all([
              supabaseDb.fetchUserLikes(user.id),
              supabaseDb.fetchUserFollows(user.id),
            ]);
            setLikedPostIds(userLikes);
            setFollowedUserIds(userFollows);
            saveStoredLikes(userLikes);
            saveStoredFollows(userFollows);
          } else {
            setLikedPostIds(getStoredLikes());
            setFollowedUserIds(getStoredFollows());
          }
        } else {
          setLikedPostIds(getStoredLikes());
          setFollowedUserIds(getStoredFollows());
          setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        const fallbackUser = getStoredUser();
        setPosts(getStoredPosts());
        setFollowedUserIds(getStoredFollows());
        setLikedPostIds(getStoredLikes());
        if (fallbackUser) {
          setCurrentUser(fallbackUser);
        } else {
          setIsOnboardingOpen(true);
        }
      } finally {
        setIsInitialized(true);
      }
    }

    initApp();
  }, []);

  // Handle Onboarding / Login Completion
  const handleOnboardingComplete = async (user: User) => {
    setCurrentUser(user);
    saveStoredUser(user);
    setIsOnboardingOpen(false);

    const { isConfigured } = getSupabaseConfig();
    if (isConfigured) {
      const [userLikes, userFollows] = await Promise.all([
        supabaseDb.fetchUserLikes(user.id),
        supabaseDb.fetchUserFollows(user.id),
      ]);
      setLikedPostIds(userLikes);
      setFollowedUserIds(userFollows);
    }
  };

  // Handle Like Toggle
  const handleLikeToggle = async (postId: string) => {
    const userId = currentUser?.id || 'guest_user';
    const isCurrentlyLiked = likedPostIds.includes(postId);
    const updatedLikedPostIds = isCurrentlyLiked
      ? likedPostIds.filter((id) => id !== postId)
      : [...likedPostIds, postId];

    setLikedPostIds(updatedLikedPostIds);
    saveStoredLikes(updatedLikedPostIds);

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const currentLikes = post.likes || 0;
        const newLikes = isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
        const currentLikedBy = post.likedBy || [];
        const newLikedBy = isCurrentlyLiked
          ? currentLikedBy.filter((uid) => uid !== userId)
          : [...currentLikedBy, userId];

        return {
          ...post,
          likes: newLikes,
          likedBy: newLikedBy,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    saveStoredPosts(updatedPosts);

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => {
        if (!prev) return null;
        const isNowLiked = !isCurrentlyLiked;
        return {
          ...prev,
          likes: isNowLiked ? (prev.likes || 0) + 1 : Math.max(0, (prev.likes || 0) - 1),
        };
      });
    }

    const { isConfigured } = getSupabaseConfig();
    if (isConfigured && currentUser) {
      await supabaseDb.toggleLike(postId, currentUser.id, isCurrentlyLiked);
    }
  };

  // Handle Follow Toggle
  const handleFollowToggle = async (userIdToToggle: string) => {
    const isCurrentlyFollowing = followedUserIds.includes(userIdToToggle);
    const updatedFollows = isCurrentlyFollowing
      ? followedUserIds.filter((id) => id !== userIdToToggle)
      : [...followedUserIds, userIdToToggle];

    setFollowedUserIds(updatedFollows);
    saveStoredFollows(updatedFollows);

    const { isConfigured } = getSupabaseConfig();
    if (isConfigured && currentUser) {
      await supabaseDb.toggleFollow(currentUser.id, userIdToToggle, isCurrentlyFollowing);
    }
  };

  // Handle Upload / Create Post
  const handlePostCreated = (newPost: Post) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    saveStoredPosts(updated);
    setActiveTab('home');
  };

  // Handle Delete Post
  const handleDeletePost = async (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    saveStoredPosts(updated);

    const { isConfigured } = getSupabaseConfig();
    if (isConfigured && currentUser) {
      await supabaseDb.deletePost(postId, currentUser.id);
    }
  };

  // Handle Update User Profile
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    saveStoredUser(updatedUser);

    const updatedPosts = posts.map((p) => {
      if (p.userId === updatedUser.id) {
        return {
          ...p,
          userName: updatedUser.name,
          userAvatarBg: updatedUser.avatarColor,
          userAvatarLetter: updatedUser.avatarLetter,
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    saveStoredPosts(updatedPosts);
  };

  // Handle User Sign Out
  const handleSignOut = async () => {
    const { isConfigured } = getSupabaseConfig();
    if (isConfigured) {
      await supabaseAuth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem('doodleboard_user');
    setIsOnboardingOpen(true);
  };

  // Handle Reset to Starter Sample Data
  const handleResetDemoData = () => {
    const { posts: freshPosts } = resetToDemoData();
    setPosts(freshPosts);
    setLikedPostIds([]);
    setFollowedUserIds([]);
  };

  const handleOpenUpload = () => {
    if (!currentUser) {
      setIsOnboardingOpen(true);
      return;
    }
    setIsUploadOpen(true);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-red-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased selection:bg-black selection:text-white pb-20 md:pb-6">
      
      {/* Sticky Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={handleOpenUpload}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSupabaseSetup={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeFeed
            posts={posts}
            currentUser={currentUser}
            likedPostIds={likedPostIds}
            followedUserIds={followedUserIds}
            onLikeToggle={handleLikeToggle}
            onFollowToggle={handleFollowToggle}
            onCardClick={(post) => setSelectedPost(post)}
            onOpenUpload={handleOpenUpload}
          />
        )}

        {activeTab === 'search' && (
          <SearchTab
            posts={posts}
            currentUser={currentUser}
            likedPostIds={likedPostIds}
            followedUserIds={followedUserIds}
            onLikeToggle={handleLikeToggle}
            onFollowToggle={handleFollowToggle}
            onCardClick={(post) => setSelectedPost(post)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            currentUser={currentUser}
            posts={posts}
            likedPostIds={likedPostIds}
            followedUserIds={followedUserIds}
            onUpdateUser={handleUpdateUser}
            onOpenUpload={handleOpenUpload}
            onLikeToggle={handleLikeToggle}
            onFollowToggle={handleFollowToggle}
            onCardClick={(post) => setSelectedPost(post)}
            onResetDemoData={handleResetDemoData}
            onOpenSupabaseSetup={() => setIsSupabaseModalOpen(true)}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={handleOpenUpload}
        currentUser={currentUser}
      />

      {/* Fullscreen Post Lightbox / Viewer */}
      {selectedPost && (
        <FullscreenViewer
          post={selectedPost}
          currentUser={currentUser}
          likedPostIds={likedPostIds}
          followedUserIds={followedUserIds}
          onClose={() => setSelectedPost(null)}
          onLikeToggle={handleLikeToggle}
          onFollowToggle={handleFollowToggle}
          onDeletePost={handleDeletePost}
        />
      )}

      {/* Upload Drawing / Doodle Modal */}
      {isUploadOpen && currentUser && (
        <UploadModal
          isOpen={isUploadOpen}
          currentUser={currentUser}
          onClose={() => setIsUploadOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* First-Time Profile Creation Onboarding Modal */}
      {isOnboardingOpen && (
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleOnboardingComplete}
          onOpenSupabaseSetup={() => setIsSupabaseModalOpen(true)}
        />
      )}

      {/* Supabase Connection & SQL Setup Modal */}
      {isSupabaseModalOpen && (
        <SupabaseStatusModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          onConfigured={async () => {
            const newPosts = await supabaseDb.fetchPosts();
            if (newPosts && newPosts.length > 0) {
              setPosts(newPosts);
            }
          }}
        />
      )}

    </div>
  );
}

