import { createClient } from '@supabase/supabase-js';

// Supabase Environment variables with guaranteed trimmed URL and no trailing slashes
const SUPABASE_URL = 'https://klkcebognzimoxyptjbf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IRek43f4NrXZ0uxKfUlfMQ_4PmXyora';

// Standard Supabase client instance with clean default options and no invalid custom headers
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
