import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mail, UserCheck, Lock, AlertCircle, Database } from 'lucide-react';
import { getRandomAvatarColor } from '../services/storage';
import { supabaseAuth, getSupabaseConfig } from '../services/supabase';
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
  const [authMode, setAuthMode] = useState<'anonymous' | 'email_signup' | 'email_login'>('anonymous');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();

  if (!isOpen) return null;

  const previewLetter = name.trim() ? name.trim().charAt(0).toUpperCase() : 'D';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (authMode === 'anonymous') {
        if (!name.trim()) {
          setErrorMessage('Please enter your name');
          setLoading(false);
          return;
        }

        if (isConfigured) {
          // Attempt Supabase anonymous sign in or profile creation
          const res = await supabaseAuth.signInAnonymously(name.trim());
          if (res.error) {
            console.warn('Supabase anonymous auth warning:', res.error);
            // Fallback to local guest profile if anonymous auth is disabled on Supabase
            const fallbackUser: User = {
              id: 'user_' + Date.now().toString(36),
              name: name.trim(),
              username: `@${name.trim().toLowerCase().replace(/\s+/g, '_')}`,
              avatarLetter: name.trim().charAt(0).toUpperCase(),
              avatarColor: selectedColor,
              bio: bio.trim() || 'Doodler on DoodleBoard',
              createdAt: Date.now(),
              isAnonymous: true,
            };
            onComplete(fallbackUser);
          } else if (res.user) {
            res.user.avatarColor = selectedColor;
            if (bio) res.user.bio = bio;
            onComplete(res.user);
          }
        } else {
          // Local/Demo Mode
          const fallbackUser: User = {
            id: 'user_' + Date.now().toString(36),
            name: name.trim(),
            username: `@${name.trim().toLowerCase().replace(/\s+/g, '_')}`,
            avatarLetter: name.trim().charAt(0).toUpperCase(),
            avatarColor: selectedColor,
            bio: bio.trim() || 'Doodler on DoodleBoard',
            createdAt: Date.now(),
            isAnonymous: true,
          };
          onComplete(fallbackUser);
        }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-y-auto"
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
            A visual Pinterest board for drawings, sketches, and digital art with Supabase backend.
          </p>
        </div>

        {/* Auth Method Selector */}
        <div className="flex bg-gray-100 p-1 rounded-full text-xs font-bold w-full max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setAuthMode('anonymous');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              authMode === 'anonymous' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Instant Doodler
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('email_signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              authMode !== 'anonymous' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Auth
          </button>
        </div>

        {/* Live Avatar Preview (for name based setup) */}
        {authMode !== 'email_login' && (
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md transition-all duration-300 ring-4 ring-gray-100"
              style={{ backgroundColor: selectedColor }}
            >
              {previewLetter}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              Profile Avatar Preview
            </span>
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
          
          {authMode !== 'email_login' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-800">
                Your Creator Name <span className="text-red-600">*</span>
              </label>
              <input
                id="onboarding-name-input"
                type="text"
                required
                autoFocus
                placeholder="e.g. Maya Chen or SketchyArt"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim() && !selectedColor) {
                    setSelectedColor(getRandomAvatarColor(e.target.value));
                  }
                }}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
              />
            </div>
          )}

          {authMode !== 'anonymous' && (
            <>
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

          {authMode === 'anonymous' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-800">
                Short bio <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="onboarding-bio-input"
                type="text"
                placeholder="e.g. Passionate about ink sketches and doodles ✏️"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:bg-white focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Color Chooser for Anonymous/Signup */}
          {authMode !== 'email_login' && (
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
                ? 'Connecting...'
                : authMode === 'anonymous'
                ? 'Start Exploring DoodleBoard'
                : authMode === 'email_signup'
                ? 'Create Supabase Profile & Join'
                : 'Sign In'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Switch between email sign up and login */}
          {authMode !== 'anonymous' && (
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
              {isConfigured ? 'Supabase Backend Connected' : 'Supabase (Demo/Setup Mode)'}
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

