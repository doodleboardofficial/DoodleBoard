import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://klkcebognzimoxyptjbf.supabase.co';
export const supabaseAnonKey = 'sb_publishable_IRek43f4NrXZ0uxKfUlfMQ_4PmXyora';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
