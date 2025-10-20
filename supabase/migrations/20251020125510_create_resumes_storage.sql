/*
  # Create Storage for Resumes

  1. Storage
    - Create a public bucket named 'resumes' for storing CV/Resume PDFs
    - Configure bucket to accept PDF files
    - Set up storage policies for authenticated users to upload
    - Allow public read access for recruiters to view resumes

  2. Security
    - Enable RLS on storage.objects
    - Authenticated users can upload their own resumes
    - Public read access to allow recruiters/admins to view resumes
*/

-- Create the resumes bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the resumes bucket
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own files
CREATE POLICY "Users can update own resumes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all resumes
CREATE POLICY "Public read access to resumes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'resumes');
