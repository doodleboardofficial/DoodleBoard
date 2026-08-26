import React, { useState } from 'react';
import {
  ShieldAlert,
  Crown,
  BadgeCheck,
  Sparkles,
  Save,
  RotateCcw,
  Download,
  Upload,
  Search,
  Plus,
  Trash2,
  Lock,
  Eye,
  CheckCircle2,
  X,
  ExternalLink,
  Users,
  Image as ImageIcon,
  Flame,
  ArrowLeft,
  Copy,
} from 'lucide-react';
import {
  useUserStore,
  StoredUser,
  ADMIN_PASSWORD,
  formatFollowerCountReal,
} from '../store/userStore';

interface GodAdminPanelProps {
  onClose: () => void;
  onViewProfile?: (username: string) => void;
}

export const GodAdminPanel: React.FC<GodAdminPanelProps> = ({
  onClose,
  onViewProfile,
}) => {
  const {
    users,
    isAdminAuthenticated,
    setAdminAuthenticated,
    updateUser,
    saveAllUsers,
    resetAll,
    addUser,
    deleteUser,
    importJSON,
    exportJSON,
  } = useUserStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserBio, setNewUserBio] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [newUserFollowers, setNewUserFollowers] = useState<number>(0);
  const [newUserFollowing, setNewUserFollowing] = useState<number>(0);
  const [newUserVerified, setNewUserVerified] = useState(false);
  const [newUserOwner, setNewUserOwner] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setPasswordError(false);
      showToast('⚡ Super Admin Granted: Welcome Pranjali!');
    } else {
      setPasswordError(true);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.bio && u.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePresetFollowers = (userId: string, count: number) => {
    updateUser(userId, { followers: count });
    showToast(`Updated followers to ${formatFollowerCountReal(count)}`);
  };

  const handleSaveAll = () => {
    saveAllUsers(users);
    showToast('✨ Updated! All user changes written to store');
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all users and stats back to initial defaults?')) {
      resetAll();
      showToast('🔄 Store reset to initial baseline');
    }
  };

  const handleExport = () => {
    const json = exportJSON();
    navigator.clipboard.writeText(json);
    // Also trigger file download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doodleboard_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 JSON Copied to Clipboard & Downloaded!');
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = importJSON(importJsonText);
    if (success) {
      setIsImportModalOpen(false);
      setImportJsonText('');
      showToast('✅ Real Data Imported Successfully!');
    } else {
      alert('Invalid JSON format. Please ensure valid JSON structure with { users: [...] }');
    }
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim()) return;

    const cleanUsername = newUserUsername.replace(/^@/, '').toLowerCase().trim();
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      name: newUserName.trim(),
      bio: newUserBio.trim() || '🎨 DoodleBoard Creator & Artist',
      avatar:
        newUserAvatar.trim() ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80`,
      followers: Number(newUserFollowers) || 0,
      following: Number(newUserFollowing) || 0,
      verified: newUserVerified,
      owner: newUserOwner,
      banned: false,
      featured: true,
      createdAt: Date.now(),
    };

    addUser(newUser);
    setIsNewUserModalOpen(false);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserBio('');
    setNewUserAvatar('');
    setNewUserFollowers(0);
    setNewUserFollowing(0);
    setNewUserVerified(false);
    setNewUserOwner(false);
    showToast(`🎉 Created user @${cleanUsername}!`);
  };

  // PASSWORD AUTHENTICATION SCREEN
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md text-slate-100 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
          {/* Ghibli magical background aura */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                GOD ADMIN PANEL
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  v777 PRO
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Owner Secret Zone: <span className="font-mono text-emerald-400">/admin-pranjali-777</span>
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Secret Passkey</span>
                <span className="text-[10px] text-slate-500 font-normal">Protected</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Enter secret owner passphrase..."
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition pr-10 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
              {passwordError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" /> Incorrect secret passkey. Hint: PRANJALI_IS_OWNER_2026
                </p>
              )}
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Pranjali Prasad Admin Privileges:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
                <li>Instant real follower multiplier (up to 10,000,000)</li>
                <li>Toggle Verified Blue Check & 👑 Owner Badges</li>
                <li>Direct export/import & live JSON state editing</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED GOD ADMIN INTERFACE
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 animate-bounce text-sm">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="px-4 md:px-8 py-4 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/20 shrink-0 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit to App</span>
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              <span>👑 GOD ADMIN PANEL</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO 777
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Live Real-Store Database Controller & Follower Multiplier
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSaveAll}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All</span>
          </button>

          <button
            onClick={() => setIsNewUserModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Creator</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
            title="Export JSON backup"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
            title="Import JSON backup"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Import</span>
          </button>

          <button
            onClick={handleResetAll}
            className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition"
            title="Reset store to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {/* Search & Quick Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators by name, @username, or bio..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">{users.length}</div>
              <div className="text-xs text-slate-400">Total Registered Creators</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">
                {users.filter((u) => u.owner).length} Owner / {users.filter((u) => u.verified).length} Verified
              </div>
              <div className="text-xs text-slate-400">Authority Badges</div>
            </div>
          </div>
        </div>

        {/* Creator User Management Cards / Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" /> Creators Database ({filteredUsers.length})
            </h2>
            <span className="text-xs text-slate-500">
              Values automatically update store & localStorage
            </span>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 md:p-6 rounded-3xl border transition-all ${
                  user.owner
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Column 1: Avatar & Identity Header (3 cols) */}
                  <div className="lg:col-span-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md bg-slate-800"
                          onError={(e) => {
                            // Fallback if broken image URL
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
                          }}
                        />
                        {user.owner && (
                          <span className="absolute -top-2 -right-1 text-sm">👑</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white text-base truncate">
                            {user.name}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-emerald-400">@{user.username}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.id}</div>
                      </div>
                    </div>

                    {/* View Profile Action */}
                    {onViewProfile && (
                      <button
                        onClick={() => {
                          onViewProfile(user.username);
                          onClose();
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Live Profile</span>
                      </button>
                    )}

                    {/* Quick Preset Follower Buttons */}
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        ⚡ Quick Follower Presets
                      </span>
                      <div className="grid grid-cols-6 gap-1">
                        {[0, 1000, 10000, 100000, 1000000, 10000000].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => handlePresetFollowers(user.id, preset)}
                            className="py-1 px-1 rounded-lg bg-slate-800/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 font-bold text-[10px] transition text-center"
                            title={`Set to exact ${preset.toLocaleString()}`}
                          >
                            {preset === 0 ? '0' : preset === 1000 ? '1K' : preset === 10000 ? '10K' : preset === 100000 ? '100K' : preset === 1000000 ? '1M' : '10M'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Editable Info Fields (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => updateUser(user.id, { name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Username (@)
                        </label>
                        <input
                          type="text"
                          value={user.username}
                          onChange={(e) =>
                            updateUser(user.id, {
                              username: e.target.value.replace(/^@/, '').toLowerCase().trim(),
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                        <span>Avatar URL / SVG Data</span>
                        <ImageIcon className="w-3 h-3 text-slate-500" />
                      </label>
                      <input
                        type="text"
                        value={user.avatar}
                        onChange={(e) => updateUser(user.id, { avatar: e.target.value })}
                        placeholder="Image URL or data:image/svg+xml..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-mono truncate focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Bio Description
                      </label>
                      <textarea
                        rows={2}
                        value={user.bio}
                        onChange={(e) => updateUser(user.id, { bio: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Column 3: Stats & God Authority Toggles (4 cols) */}
                  <div className="lg:col-span-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-3.5">
                    {/* Numbers: Followers & Following */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                          Followers (Max 10M)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={10000000}
                            value={user.followers ?? 0}
                            onChange={(e) =>
                              updateUser(user.id, {
                                followers: Math.max(0, parseInt(e.target.value) || 0),
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-black text-emerald-300 focus:outline-none focus:border-emerald-400 font-mono"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Format: {formatFollowerCountReal(user.followers || 0)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Following
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={10000000}
                          value={user.following ?? 0}
                          onChange={(e) =>
                            updateUser(user.id, {
                              following: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-black text-slate-200 focus:outline-none focus:border-slate-500 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Format: {formatFollowerCountReal(user.following || 0)}
                        </span>
                      </div>
                    </div>

                    {/* God Authority Toggle Switches */}
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                      {/* Verified Toggle */}
                      <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4 text-[#1D9BF0]" />
                          <span className="text-xs font-semibold text-slate-200">Verified Blue Tick</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(user.verified)}
                          onChange={(e) => updateUser(user.id, { verified: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400 cursor-pointer"
                        />
                      </label>

                      {/* Owner Crown Toggle */}
                      <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-300">👑 Owner Status</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(user.owner)}
                          onChange={(e) => updateUser(user.id, { owner: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                        />
                      </label>

                      {/* Featured on Explore */}
                      <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-slate-300">Featured Creator</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(user.featured ?? true)}
                          onChange={(e) => updateUser(user.id, { featured: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                        />
                      </label>

                      {/* Banned Status Toggle */}
                      <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-semibold text-rose-300">Banned Status</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={Boolean(user.banned)}
                          onChange={(e) => updateUser(user.id, { banned: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Delete User Button */}
                    {!user.owner && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete creator @${user.username}?`)) {
                              deleteUser(user.id);
                              showToast(`Deleted @${user.username}`);
                            }
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium hover:underline p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* IMPORT JSON MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" /> Import Real Data JSON
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Paste exported JSON containing <code className="text-emerald-400">users</code> and optional <code className="text-emerald-400">posts</code> to restore or batch-update state.
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here: { users: [...], posts: [...] }"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                Import & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW CREATOR MODAL */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Create New Creator
              </h3>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Satoshi Kon"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  placeholder="e.g. satoshi_art"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={newUserAvatar}
                  onChange={(e) => setNewUserAvatar(e.target.value)}
                  placeholder="Image URL or leave blank for default"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={newUserBio}
                  onChange={(e) => setNewUserBio(e.target.value)}
                  placeholder="Artist bio & style description..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Followers</label>
                  <input
                    type="number"
                    min={0}
                    value={newUserFollowers}
                    onChange={(e) => setNewUserFollowers(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Following</label>
                  <input
                    type="number"
                    min={0}
                    value={newUserFollowing}
                    onChange={(e) => setNewUserFollowing(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserVerified}
                    onChange={(e) => setNewUserVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-500"
                  />
                  <span className="text-xs text-slate-300">Verified Tick</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserOwner}
                    onChange={(e) => setNewUserOwner(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span className="text-xs text-amber-300">👑 Owner</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                >
                  Create Creator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
