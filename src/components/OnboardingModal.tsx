import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Lock, AlertCircle, Database, AtSign, Crown } from 'lucide-react';
import { getRandomAvatarColor } from '../services/storage';
import { supabaseAuth, getSupabaseConfig } from '../services/supabase';
import { authenticateOrSignUpUser } from '../firebase';
import { useUserStore } from '../store/userStore';
import { User } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: User) => void;
  onOpenSupabaseSetup?: () => void;
}

const AVATAR_COLORS = [
  '#2563EB', '#4F46E5', '#7C3AED', '#DB2777', 
  '#DC2626', '#D97706', '#059669', '#0891B2', '#1E293B'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onOpenSupabaseSetup,
}) => {
  const [authMode, setAuthMode] = useState<'username' | 'email_signup' | 'email_login'>('username');
  const [usernameInput, setUsernameInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();
  const { addUser, getUserByUsername } = useUserStore();

  if (!isOpen) return null;

  const previewLetter = name.trim()
    ? name.trim().charAt(0).toUpperCase()
    : usernameInput.trim()
    ? usernameInput.trim().replace(/^@/, '').charAt(0).toUpperCase()
    : 'P';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (authMode === 'username') {
        const cleanUser = usernameInput.trim().replace(/^@/, '').toLowerCase();
        if (!cleanUser) {
          setErrorMessage('Please enter a username (e.g. pranjali)');
          setLoading(false);
          return;
        }

        const isPranjali = cleanUser === 'pranjali';
        const displayName = name.trim() || (isPranjali ? 'Pranjali Prasad' : cleanUser);

        // 1. Create or retrieve Firestore user doc
        const firestoreUser = await authenticateOrSignUpUser(cleanUser, displayName);

        // 2. Ensure in userStore
        const existing = getUserByUsername(cleanUser);
        if (!existing) {
          addUser({
            id: firestoreUser.id,
            username: cleanUser,
            name: firestoreUser.name,
            bio: firestoreUser.bio || (isPranjali ? '👑 Founder & Lead Creator @ DoodleBoard' : '🎨 DoodleBoard Creator'),
            avatar: firestoreUser.avatar || (isPranjali
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80'),
            followers: firestoreUser.followersCount ?? 0,
            following: firestoreUser.followingCount ?? 0,
            verified: isPranjali ? true : Boolean(firestoreUser.verified),
            owner: isPranjali ? true : Boolean(firestoreUser.owner),
            banned: false,
            featured: isPranjali ? true : Boolean(firestoreUser.featured),
            createdAt: Date.now(),
          });
        }

        const appUser: User = {
          id: firestoreUser.id,
          name: firestoreUser.name,
          username: `@${cleanUser}`,
          avatarLetter: displayName.charAt(0).toUpperCase(),
          avatarColor: isPranjali ? '#D97706' : selectedColor,
          avatarImage: firestoreUser.avatar,
          bio: firestoreUser.bio,
          createdAt: Date.now(),
          isOwner: isPranjali || Boolean(firestoreUser.owner),
          isVerified: isPranjali || Boolean(firestoreUser.verified),
          is_owner: isPranjali || Boolean(firestoreUser.owner),
          is_verified: isPranjali || Boolean(firestoreUser.verified),
        };

        onComplete(appUser);
      } else if (authMode === 'email_signup') {
        if (!email.trim() || !password || !name.trim()) {
          setErrorMessage('Please fill in your name, email, and password');
          setLoading(false);
          return;
        }

        if (!isConfigured) {
          setErrorMessage('Supabase is not configured yet. Connect your Supabase project in the setup menu.');
          setLoading(false);
          return;
        }

        const res = await supabaseAuth.signUp(email, password, name.trim());
        if (res.error) {
          setErrorMessage(res.error);
          setLoading(false);
          return;
        }

        if (res.user) {
          res.user.avatarColor = selectedColor;
          onComplete(res.user);
        }
      } else if (authMode === 'email_login') {
        if (!email.trim() || !password) {
          setErrorMessage('Please enter both email and password');
          setLoading(false);
          return;
        }

        if (!isConfigured) {
          setErrorMessage('Supabase is not configured yet. Connect your Supabase project in the setup menu.');
          setLoading(false);
          return;
        }

        const res = await supabaseAuth.signIn(email, password);
        if (res.error) {
          setErrorMessage(res.error);
          setLoading(false);
          return;
        }

        if (res.user) {
          onComplete(res.user);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="onboarding-modal-content"
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in zoom-in-95 duration-200 my-8"
      >
        {/* Header Icon & Title */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
            <span className="font-bold text-2xl">D</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome to DoodleBoard
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Live Firebase & Firestore powered community for drawings, sketches & visual art.
          </p>
        </div>

        {/* Auth Method Selector */}
        <div className="flex bg-gray-100 p-1 rounded-full text-xs font-bold w-full max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setAuthMode('username');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              authMode === 'username' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Username Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('email_signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              authMode !== 'username' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email / Supabase
          </button>
        </div>

        {/* Live Avatar Preview */}
        {authMode !== 'email_login' && (
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md transition-all duration-300 ring-4 ${
                usernameInput.toLowerCase().trim() === 'pranjali'
                  ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 ring-amber-300'
                  : 'ring-gray-100'
              }`}
              style={{
                backgroundColor: usernameInput.toLowerCase().trim() === 'pranjali' ? undefined : selectedColor,
              }}
            >
              {usernameInput.toLowerCase().trim() === 'pranjali' ? '👑' : previewLetter}
            </div>
            {usernameInput.toLowerCase().trim() === 'pranjali' && (
              <span className="text-[11px] font-black text-amber-600 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Founder & Owner Account
              </span>
            )}
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-start gap-2 text-left font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          
          {authMode === 'username' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                  <span>Username <span className="text-red-600">*</span></span>
                  <span className="text-[10px] text-gray-400">Hint: try "pranjali" for Owner</span>
                </label>
                <div className="relative">
                  <input
                    id="onboarding-username-input"
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. pranjali or maya_art"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none font-mono"
                  />
                  <AtSign className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800">
                  Display Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="onboarding-name-input"
                  type="text"
                  placeholder="e.g. Pranjali Prasad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
            </>
          )}

          {authMode === 'email_signup' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800">
                  Your Creator Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="onboarding-name-input"
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Maya Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="onboarding-email-input"
                  type="email"
                  required
                  placeholder="artist@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  id="onboarding-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                />
              </div>
            </>
          )}

          {authMode === 'email_login' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="onboarding-email-login-input"
                  type="email"
                  required
                  placeholder="artist@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  id="onboarding-password-login-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
                />
              </div>
            </>
          )}

          {/* Color Chooser for Username/Signup */}
          {authMode === 'username' && (
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-gray-800">
                Avatar Accent Color
              </label>
              <div className="flex flex-wrap gap-2 justify-center py-1">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      selectedColor === c ? 'scale-120 ring-2 ring-black ring-offset-2' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            id="start-exploring-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-black hover:bg-gray-800 disabled:opacity-50 text-white rounded-full text-sm font-bold transition-transform active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {loading
                ? 'Authenticating...'
                : authMode === 'username'
                ? 'Join / Login with Username'
                : authMode === 'email_signup'
                ? 'Create Supabase Profile & Join'
                : 'Sign In'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Switch between email sign up and login */}
          {authMode !== 'username' && (
            <div className="text-center pt-1">
              {authMode === 'email_signup' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email_login');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-gray-600 hover:text-black font-semibold cursor-pointer"
                >
                  Already have an account? <strong>Sign In</strong>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email_signup');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-gray-600 hover:text-black font-semibold cursor-pointer"
                >
                  Don't have an account? <strong>Sign Up</strong>
                </button>
              )}
            </div>
          )}

        </form>

        {/* Supabase backend status pill / configuration link */}
        {onOpenSupabaseSetup && (
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isConfigured ? 'Supabase Backend Connected' : 'Firestore + Supabase (Dual)'}
            </span>
            <button
              type="button"
              onClick={onOpenSupabaseSetup}
              className="text-red-600 hover:underline font-bold cursor-pointer"
            >
              SQL / Config
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

