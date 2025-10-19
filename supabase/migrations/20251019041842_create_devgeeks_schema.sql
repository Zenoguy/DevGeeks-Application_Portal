/*
  # DevGeeks Job Portal Database Schema

  ## Overview
  Complete database schema for DevGeeks job/internship portal with authentication, job management, and applications.

  ## New Tables

  ### `jobs`
  - `id` (uuid, primary key) - Unique job identifier
  - `title` (text) - Job title
  - `company` (text) - Company name
  - `location` (text) - Job location
  - `type` (text) - Employment type (Full-time, Part-time, Internship, Contract)
  - `salary` (text, nullable) - Salary information
  - `description` (text) - Job description
  - `requirements` (text[]) - Array of requirements
  - `posted_date` (date) - Date job was posted
  - `featured` (boolean) - Whether job is featured
  - `created_at` (timestamptz) - Record creation timestamp
  - `created_by` (uuid, foreign key) - User who created the job
  - `updated_at` (timestamptz) - Last update timestamp

  ### `applications`
  - `id` (uuid, primary key) - Unique application identifier
  - `job_id` (uuid, foreign key) - Reference to jobs table
  - `user_id` (uuid, foreign key) - Reference to auth.users
  - `status` (text) - Application status (pending, reviewing, accepted, rejected)
  - `applied_at` (timestamptz) - Application timestamp
  - `notes` (text, nullable) - Additional notes

  ### `profiles`
  - `id` (uuid, primary key, foreign key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `is_admin` (boolean) - Admin status
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Jobs: Public read access, authenticated admins can create/update/delete
  - Applications: Users can only view/create their own applications
  - Profiles: Users can read all profiles, but only update their own

  ## Important Notes
  1. All tables use RLS for security
  2. Foreign key constraints ensure data integrity
  3. Timestamps track record lifecycle
  4. Indexes added for performance on frequently queried columns
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Internship', 'Contract')),
  salary text,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  posted_date date DEFAULT CURRENT_DATE,
  featured boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Anyone can view jobs"
  ON jobs FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  applied_at timestamptz DEFAULT now(),
  notes text,
  UNIQUE(job_id, user_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated users can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
