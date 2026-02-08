import { NhostClient } from '@nhost/react';

const nhostSubdomain = import.meta.env.VITE_NHOST_SUBDOMAIN;
const nhostRegion = import.meta.env.VITE_NHOST_REGION;

if (!nhostSubdomain || !nhostRegion) {
  throw new Error('Missing Nhost environment variables');
}

export const nhost = new NhostClient({
  subdomain: nhostSubdomain,
  region: nhostRegion,
});

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
