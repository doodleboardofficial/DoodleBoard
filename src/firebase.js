/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DoodleBoard Level 4 - Real Firebase Backend + Firestore Integration
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  runTransaction,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

// Default / fallback Firebase config with env override
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyForDoodleBoardApp2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'doodleboard-5af84.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'doodleboard-5af84',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'doodleboard-5af84.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1029384756:web:abcdef123456789',
};

// Initialize Firebase App & Firestore safely
let app = null;
let db = null;
let isFirebaseOnline = false;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseOnline = true;
} catch (err) {
  console.warn('Firebase initialization notice:', err);
  isFirebaseOnline = false;
}

export { app, db, isFirebaseOnline };

// Firestore Collections Names
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  FOLLOWS: 'follows',
};

/**
 * Real Firestore User Profile Interface
 * { username, name, bio, followersCount, followingCount, verified, owner, avatar, banned, featured }
 */

/**
 * Authenticate or Register a user by Username
 * On signup create Firestore user doc with followersCount: 0.
 * If username is "pranjali", set owner: true, verified: true.
 */
export async function authenticateOrSignUpUser(username, displayName, avatarUrl) {
  const cleanUsername = (username || '').trim().replace(/^@/, '').toLowerCase();
  if (!cleanUsername) throw new Error('Username cannot be empty');

  const isPranjali = cleanUsername === 'pranjali';
  const userId = `user-${cleanUsername}`;

  if (db && isFirebaseOnline) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const existingData = userSnap.data();
        return {
          id: userId,
          ...existingData,
        };
      }

      // Create new Firestore user document
      const newUserData = {
        id: userId,
        username: cleanUsername,
        name: displayName || (isPranjali ? 'Pranjali Prasad' : cleanUsername),
        bio: isPranjali
          ? '👑 Founder & Lead Creator @ DoodleBoard\n🌿 Studio Ghibli dreamer & visual storyteller\n✨ Building whimsical worlds one brushstroke at a time'
          : `✨ Art enthusiast & sketch lover on DoodleBoard. Sharing daily creative doodles!`,
        followersCount: 0,
        followingCount: 0,
        verified: isPranjali ? true : false,
        owner: isPranjali ? true : false,
        avatar: avatarUrl || (isPranjali
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
          : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80`),
        banned: false,
        featured: isPranjali ? true : false,
        createdAt: Date.now(),
      };

      await setDoc(userRef, newUserData);
      return newUserData;
    } catch (e) {
      console.warn('Firestore sign-up failed, using local sync:', e);
    }
  }

  // Fallback data structure matching Firestore
  return {
    id: userId,
    username: cleanUsername,
    name: displayName || (isPranjali ? 'Pranjali Prasad' : cleanUsername),
    bio: isPranjali
      ? '👑 Founder & Lead Creator @ DoodleBoard\n🌿 Studio Ghibli dreamer & visual storyteller'
      : '✨ Sketch lover on DoodleBoard',
    followersCount: 0,
    followingCount: 0,
    verified: isPranjali,
    owner: isPranjali,
    avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    banned: false,
    featured: isPranjali,
  };
}

/**
 * Real Follow with Firestore Transaction:
 * Creates follow document in `follows` collection: { followerId, followingId }
 * Increment target user's followersCount
 * Increment follower user's followingCount
 */
export async function followUserTransaction(followerId, targetUserId) {
  if (!followerId || !targetUserId || followerId === targetUserId) return false;
  const followDocId = `${followerId}_${targetUserId}`;

  if (db && isFirebaseOnline) {
    try {
      await runTransaction(db, async (transaction) => {
        const followRef = doc(db, COLLECTIONS.FOLLOWS, followDocId);
        const targetUserRef = doc(db, COLLECTIONS.USERS, targetUserId);
        const followerUserRef = doc(db, COLLECTIONS.USERS, followerId);

        const followSnap = await transaction.get(followRef);
        if (followSnap.exists()) {
          // Already following
          return;
        }

        // 1. Create Follow Doc
        transaction.set(followRef, {
          id: followDocId,
          followerId: followerId,
          followingId: targetUserId,
          createdAt: Date.now(),
        });

        // 2. Increment target followersCount
        transaction.update(targetUserRef, {
          followersCount: increment(1),
        });

        // 3. Increment follower followingCount
        transaction.update(followerUserRef, {
          followingCount: increment(1),
        });
      });
      return true;
    } catch (e) {
      console.warn('Firestore follow transaction error:', e);
    }
  }
  return true;
}

/**
 * Real Unfollow with Firestore Transaction:
 * Deletes follow document from `follows` collection
 * Decrement target user's followersCount
 * Decrement follower user's followingCount
 */
export async function unfollowUserTransaction(followerId, targetUserId) {
  if (!followerId || !targetUserId || followerId === targetUserId) return false;
  const followDocId = `${followerId}_${targetUserId}`;

  if (db && isFirebaseOnline) {
    try {
      await runTransaction(db, async (transaction) => {
        const followRef = doc(db, COLLECTIONS.FOLLOWS, followDocId);
        const targetUserRef = doc(db, COLLECTIONS.USERS, targetUserId);
        const followerUserRef = doc(db, COLLECTIONS.USERS, followerId);

        const followSnap = await transaction.get(followRef);
        if (!followSnap.exists()) {
          // Not following
          return;
        }

        // 1. Delete Follow Doc
        transaction.delete(followRef);

        // 2. Decrement target followersCount
        transaction.update(targetUserRef, {
          followersCount: increment(-1),
        });

        // 3. Decrement follower followingCount
        transaction.update(followerUserRef, {
          followingCount: increment(-1),
        });
      });
      return true;
    } catch (e) {
      console.warn('Firestore unfollow transaction error:', e);
    }
  }
  return true;
}

/**
 * Subscribe to all users in real-time with onSnapshot
 */
export function subscribeAllUsers(callback) {
  if (!db || !isFirebaseOnline) {
    return () => {};
  }

  try {
    const usersCol = collection(db, COLLECTIONS.USERS);
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const usersList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(usersList);
      },
      (error) => {
        console.warn('Firestore subscribeAllUsers error:', error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Firestore subscribe error:', e);
    return () => {};
  }
}

/**
 * Subscribe to a specific user's live profile with onSnapshot
 */
export function subscribeUserProfile(userId, callback) {
  if (!db || !isFirebaseOnline || !userId) {
    return () => {};
  }

  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({
            id: docSnap.id,
            ...docSnap.data(),
          });
        }
      },
      (error) => {
        console.warn('Firestore subscribeUserProfile error:', error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Firestore subscribe user error:', e);
    return () => {};
  }
}

/**
 * Admin: Update any user doc fields directly in Firestore
 */
export async function adminUpdateFirestoreUser(userId, updates) {
  if (db && isFirebaseOnline && userId) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, updates);
      return true;
    } catch (e) {
      console.warn('Firestore adminUpdate error:', e);
    }
  }
  return false;
}

/**
 * Admin: Delete user from Firestore
 */
export async function adminDeleteFirestoreUser(userId) {
  if (db && isFirebaseOnline && userId) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await deleteDoc(userRef);
      return true;
    } catch (e) {
      console.warn('Firestore adminDelete error:', e);
    }
  }
  return false;
}
