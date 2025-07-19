import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  date_applied: string;
  status: 'Applied' | 'Waiting' | 'Interview' | 'Rejected';
  notes?: string;
  recontact_date?: string;
  custom_tags: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  total_applications: number;
  active_applications: number;
  interviews_scheduled: number;
  rejected_applications: number;
  last_updated: string;
}