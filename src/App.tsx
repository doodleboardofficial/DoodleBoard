/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HashRouter, useLocation, useNavigate } from 'react-router-dom';
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
  resetToDemoData,
} from './services/storage';

import { supabaseAuth, supabaseDb, getSupabaseConfig } from './services/supabase';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { SearchTab } from './components/SearchTab';
import { ActivityTab } from './components/ActivityTab';
import { ProfileTab } from './components/ProfileTab';
import { PublicProfileView } from './components/PublicProfileView';
import { GodAdminPanel } from './components/GodAdminPanel';
import { BottomNav } from './components/BottomNav';
import { FullscreenViewer } from './components/FullscreenViewer';
import { UploadModal } from './components/UploadModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import { resolveUserProfile, MockUserProfile, MOCK_USERS } from './services/mockUsers';
import { useUserStore, StoredUser } from './store/userStore';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [previousTab, setPreviousTab] = useState<TabType>('home');
  const [selectedProfileUser, setSelectedProfileUser] = useState<StoredUser | MockUserProfile | User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { toggleFollow, getUserByUsername, getUserById } = useUserStore();

  // Helper to open a public profile by username or userId
  const handleViewUserProfile = (usernameOrId: string) => {
    if (activeTab !== 'public_profile') {
      setPreviousTab(activeTab);
    }
    const clean = usernameOrId.replace(/^@/, '').toLowerCase();
    const storedUserMatch = getUserByUsername(clean) || getUserById(usernameOrId);
    
    if (storedUserMatch) {
      setSelectedProfileUser(storedUserMatch);
    } else {
      const resolved = resolveUserProfile(usernameOrId, currentUser, posts);
      setSelectedProfileUser(resolved);
    }

    navigate(`/profile/${clean}`);
    setActiveTab('public_profile');
    setIsAdminOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    navigate('/admin-pranjali-777');
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    navigate('/');
  };

  // Sync tab navigation with hash route
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') navigate('/');
    else if (tab === 'search') navigate('/search');
    else if (tab === 'activity') navigate('/activity');
    else if (tab === 'profile') navigate('/profile');
  };

  // Sync HashRouter URL with App State
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('admin-pranjali-777')) {
      setIsAdminOpen(true);
    } else if (path.startsWith('/profile/')) {
      setIsAdminOpen(false);
      const rawUsername = path.replace('/profile/', '').split('/')[0];
      if (rawUsername) {
        const clean = rawUsername.replace(/^@/, '').toLowerCase();
        const stored = getUserByUsername(clean);
        if (stored) {
          setSelectedProfileUser(stored);
        } else {
          const resolvedProfile = resolveUserProfile(rawUsername, currentUser, posts);
          setSelectedProfileUser(resolvedProfile);
        }
        setActiveTab('public_profile');
      }
    } else if (path === '/search') {
      setIsAdminOpen(false);
      setActiveTab('search');
    } else if (path === '/activity') {
      setIsAdminOpen(false);
      setActiveTab('activity');
    } else if (path === '/profile') {
      setIsAdminOpen(false);
      setActiveTab('profile');
    } else if (path === '/' || path === '') {
      setIsAdminOpen(false);
      if (activeTab !== 'home' && activeTab !== 'public_profile') {
        setActiveTab('home');
      }
    }
  }, [location.pathname, posts, currentUser, getUserByUsername]);

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

        // 4. Check initial location or direct legacy pathname
        const currentHashPath = window.location.hash.replace(/^#/, '');
        const directPath = currentHashPath || window.location.pathname;

        if (directPath.includes('admin-pranjali-777')) {
          setIsAdminOpen(true);
          navigate('/admin-pranjali-777');
        } else if (directPath.startsWith('/profile/')) {
          const rawUsername = directPath.replace('/profile/', '').split('/')[0];
          if (rawUsername) {
            const clean = rawUsername.replace(/^@/, '').toLowerCase();
            const stored = getUserByUsername(clean);
            if (stored) {
              setSelectedProfileUser(stored);
            } else {
              const resolvedProfile = resolveUserProfile(rawUsername, user, initialPosts);
              setSelectedProfileUser(resolvedProfile);
            }
            setActiveTab('public_profile');
            navigate(`/profile/${clean}`);
          }
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

  // Handle Follow Toggle with userStore synchronization
  const handleFollowToggle = async (userIdToToggle: string) => {
    const isCurrentlyFollowing = followedUserIds.includes(userIdToToggle);
    const updatedFollows = isCurrentlyFollowing
      ? followedUserIds.filter((id) => id !== userIdToToggle)
      : [...followedUserIds, userIdToToggle];

    setFollowedUserIds(updatedFollows);
    saveStoredFollows(updatedFollows);

    // Also synchronize with Zustand real userStore
    toggleFollow(userIdToToggle);

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
    navigate('/');
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] animate-spin">
          <div className="w-full h-full rounded-full bg-black" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white pb-16">
      
      {/* Sticky Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenUpload={handleOpenUpload}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSupabaseSetup={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full bg-black">
        {activeTab === 'home' && (
          <HomeFeed
            currentUser={currentUser}
            likedPostIds={likedPostIds}
            followedUserIds={followedUserIds}
            onLikeToggle={handleLikeToggle}
            onFollowToggle={handleFollowToggle}
            onCardClick={(post) => setSelectedPost(post)}
            onOpenUpload={handleOpenUpload}
            onViewUserProfile={handleViewUserProfile}
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
            onViewUserProfile={handleViewUserProfile}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityTab
            currentUser={currentUser}
            onViewUserProfile={handleViewUserProfile}
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
            onOpenAdmin={handleOpenAdmin}
            onSignOut={handleSignOut}
          />
        )}

        {activeTab === 'public_profile' && (
          <PublicProfileView
            user={selectedProfileUser || MOCK_USERS[0]}
            currentUser={currentUser}
            posts={posts}
            likedPostIds={likedPostIds}
            followedUserIds={followedUserIds}
            onBack={() => {
              navigate('/');
              setActiveTab(previousTab === 'public_profile' ? 'home' : previousTab);
            }}
            onLikeToggle={handleLikeToggle}
            onFollowToggle={handleFollowToggle}
            onCardClick={(post) => setSelectedPost(post)}
            onViewUserProfile={handleViewUserProfile}
            onEditOwnProfile={() => {
              setActiveTab('profile');
              navigate('/profile');
            }}
          />
        )}
      </main>

      {/* God Admin Panel Modal / Overlay */}
      {isAdminOpen && (
        <GodAdminPanel
          onClose={handleCloseAdmin}
          onViewProfile={(uname) => {
            handleViewUserProfile(uname);
          }}
        />
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
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
          onViewUserProfile={handleViewUserProfile}
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

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
