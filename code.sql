/*
  # Job Application Tracker Schema for Nhost

  This SQL file should be run in the Nhost SQL Editor (Hasura Console)
  Go to: Nhost Dashboard > Database > SQL Editor
  
  1. Tables
    - `applications` - Stores job application data
    - `analytics` - Stores aggregated analytics per user

  2. Security
    - Hasura permissions handle row-level security (not PostgreSQL RLS)
    - See instructions at the bottom for setting up Hasura permissions
*/

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('Applied', 'Waiting', 'Interview', 'Rejected');

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company_name text NOT NULL,
  position text NOT NULL,
  date_applied date NOT NULL,
  status application_status NOT NULL DEFAULT 'Applied',
  notes text,
  recontact_date date,
  custom_tags text[] DEFAULT '{}',
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  total_applications integer DEFAULT 0,
  active_applications integer DEFAULT 0,
  interviews_scheduled integer DEFAULT 0,
  rejected_applications integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for applications table
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update analytics
CREATE OR REPLACE FUNCTION public.update_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update analytics for the user
  INSERT INTO public.analytics (
    user_id,
    total_applications,
    active_applications,
    interviews_scheduled,
    rejected_applications,
    last_updated
  )
  SELECT 
    COALESCE(NEW.user_id, OLD.user_id),
    COUNT(*) as total_applications,
    COUNT(*) FILTER (WHERE status != 'Rejected' AND is_archived = false) as active_applications,
    COUNT(*) FILTER (WHERE status = 'Interview') as interviews_scheduled,
    COUNT(*) FILTER (WHERE status = 'Rejected') as rejected_applications,
    now()
  FROM public.applications 
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_applications = EXCLUDED.total_applications,
    active_applications = EXCLUDED.active_applications,
    interviews_scheduled = EXCLUDED.interviews_scheduled,
    rejected_applications = EXCLUDED.rejected_applications,
    last_updated = EXCLUDED.last_updated;
    
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for analytics updates
CREATE TRIGGER update_analytics_on_insert
    AFTER INSERT ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_analytics();

CREATE TRIGGER update_analytics_on_update
    AFTER UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_analytics();

CREATE TRIGGER update_analytics_on_delete
    AFTER DELETE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_analytics();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_date_applied ON public.applications(date_applied);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);

/*
  ============================================
  IMPORTANT: After running this SQL, follow these steps in Hasura Console:
  ============================================
  
  1. TRACK THE TABLES:
     - Go to Data tab > default > public
     - Click "Track" next to: applications, analytics
  
  2. SET UP PERMISSIONS FOR 'applications' TABLE:
     - Click on "applications" table > Permissions tab
     - Add permissions for role: "user"
     
     SELECT (Read):
       - Row select permissions: {"user_id": {"_eq": "X-Hasura-User-Id"}}
       - Column select permissions: Select all columns
     
     INSERT:
       - Row insert permissions: {"user_id": {"_eq": "X-Hasura-User-Id"}}
       - Column insert permissions: Select all columns EXCEPT id, created_at, updated_at
       - Column presets: Set user_id = X-Hasura-User-Id
     
     UPDATE:
       - Row update permissions (Pre-update check): {"user_id": {"_eq": "X-Hasura-User-Id"}}
       - Column update permissions: company_name, position, date_applied, status, notes, recontact_date, custom_tags, is_archived
     
     DELETE:
       - Row delete permissions: {"user_id": {"_eq": "X-Hasura-User-Id"}}
  
  3. SET UP PERMISSIONS FOR 'analytics' TABLE:
     - Click on "analytics" table > Permissions tab
     - Add permissions for role: "user"
     
     SELECT (Read):
       - Row select permissions: {"user_id": {"_eq": "X-Hasura-User-Id"}}
       - Column select permissions: Select all columns
     
     INSERT:
       - Row insert permissions: {"user_id": {"_eq": "X-Hasura-User-Id"}}
       - Column insert permissions: Select all columns EXCEPT id
       - Column presets: Set user_id = X-Hasura-User-Id
     
     UPDATE:
       - Row update permissions: {"user_id": {"_eq": "X-Hasura-User-Id"}}
       - Column update permissions: total_applications, active_applications, interviews_scheduled, rejected_applications, last_updated
*/
