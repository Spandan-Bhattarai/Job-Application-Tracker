/*
  # Job Application Tracker Schema

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `company_name` (text, required)
      - `position` (text, required)
      - `date_applied` (date, required)
      - `status` (enum: Applied, Waiting, Interview, Rejected)
      - `notes` (text, optional)
      - `recontact_date` (date, optional)
      - `custom_tags` (text array, optional)
      - `is_archived` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `total_applications` (integer, default 0)
      - `active_applications` (integer, default 0)
      - `interviews_scheduled` (integer, default 0)
      - `rejected_applications` (integer, default 0)
      - `last_updated` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to access only their own data
    - Add triggers for automatic timestamp updates
*/

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('Applied', 'Waiting', 'Interview', 'Rejected');

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_applications integer DEFAULT 0,
  active_applications integer DEFAULT 0,
  interviews_scheduled integer DEFAULT 0,
  rejected_applications integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for applications
CREATE POLICY "Users can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for analytics
CREATE POLICY "Users can read own analytics"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON analytics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for applications table
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update analytics
CREATE OR REPLACE FUNCTION update_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update analytics for the user
  INSERT INTO analytics (
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
  FROM applications 
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
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics();

CREATE TRIGGER update_analytics_on_update
    AFTER UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics();

CREATE TRIGGER update_analytics_on_delete
    AFTER DELETE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_date_applied ON applications(date_applied);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);