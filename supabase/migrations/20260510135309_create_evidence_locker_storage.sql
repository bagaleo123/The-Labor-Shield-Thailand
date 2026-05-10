/*
  # Create evidence-locker storage bucket

  Creates a public storage bucket for evidence files and payment receipts.
  Files are stored with email-based path prefix for organization.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence-locker', 'evidence-locker', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow anon uploads to evidence-locker"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'evidence-locker');

CREATE POLICY "Allow authenticated uploads to evidence-locker"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'evidence-locker');

CREATE POLICY "Allow public read of evidence-locker"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'evidence-locker');
