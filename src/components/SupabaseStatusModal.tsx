import React, { useState } from 'react';
import { X, Check, Copy, Database, ShieldCheck, HardDrive, Key, ExternalLink, RefreshCw } from 'lucide-react';
import { getSupabaseConfig, saveCustomSupabaseConfig, SUPABASE_SQL_SETUP } from '../services/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'settings'>('status');

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseConfig(supabaseUrl, anonKey);
    setSaveSuccess(true);
    onConfigUpdated();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div
      id="supabase-status-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        id="supabase-status-modal-content"
        className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto border border-gray-100 p-5 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-supabase-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Supabase Backend Setup
              {currentConfig.isConfigured ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wide">
                  Connected
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wide">
                  Local / Demo Mode
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500">
              Tables, Row Level Security, and Storage Bucket for DoodleBoard
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-full text-xs font-bold w-full max-w-sm">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              activeTab === 'status' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview & Tables
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              activeTab === 'sql' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            SQL Script
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            API Credentials
          </button>
        </div>

        {/* Tab 1: Overview & Tables */}
        {activeTab === 'status' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Configured Schema & Policies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">profiles</span>
                    <span className="text-gray-500 text-[11px]">id, name, avatar_letter, created_at</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">posts</span>
                    <span className="text-gray-500 text-[11px]">id, user_id, title, image_url, likes_count</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">likes</span>
                    <span className="text-gray-500 text-[11px]">id, post_id, user_id (unique constraint)</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">follows</span>
                    <span className="text-gray-500 text-[11px]">id, follower_id, following_id (unique)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Storage Bucket: "drawings"</h4>
                  <p className="text-[11px] text-gray-500">Public read, authenticated upload for drawing images</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Public Bucket
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 hover:text-black flex items-center gap-1 font-bold"
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveTab('sql')}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full font-bold cursor-pointer transition-colors"
              >
                View SQL Script
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: SQL Script */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Copy and run this in your Supabase project's <strong>SQL Editor</strong>:
              </p>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black hover:bg-gray-800 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-gray-900 text-gray-100 text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed border border-gray-800">
              {SUPABASE_SQL_SETUP}
            </pre>
          </div>
        )}

        {/* Tab 3: API Credentials */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-gray-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-gray-600" />
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-black focus:outline-none"
              />
              <p className="text-[10px] text-gray-400">Found in Project Settings &rarr; API &rarr; Project URL</p>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-gray-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-gray-600" />
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-black focus:outline-none font-mono"
              />
              <p className="text-[10px] text-gray-400">Found in Project Settings &rarr; API &rarr; Project API keys (anon public)</p>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Supabase credentials saved successfully!</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setSupabaseUrl('');
                  setAnonKey('');
                  saveCustomSupabaseConfig('', '');
                  onConfigUpdated();
                }}
                className="text-gray-500 hover:text-red-600 flex items-center gap-1 font-bold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Clear Custom Keys</span>
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-full font-bold cursor-pointer transition-transform active:scale-95"
              >
                Connect Supabase
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
