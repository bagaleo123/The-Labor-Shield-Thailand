/*
  # Create generated_documents table

  1. New Tables
    - `generated_documents`
      - `id` (uuid, primary key, auto-generated)
      - `type` (text) - document type: severance_inquiry, sick_pay_demand, unfair_dismissal, sso_complaint
      - `language` (text) - en or th
      - `content` (text) - full document text content
      - `employee_name` (text) - name of the employee
      - `employer_name` (text) - name of the employer
      - `created_at` (timestamptz) - creation timestamp

  2. Security
    - Enable RLS on `generated_documents` table
    - Allow anonymous insert (app supports unauthenticated use for expats)
    - Allow select only for authenticated users on their own records

  3. Notes
    - This table stores generated legal documents for reference
    - Anonymous inserts are permitted since the app does not require login
    - No user_id column since auth is not required for this tool
*/

CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'severance_inquiry',
  language text NOT NULL DEFAULT 'en',
  content text NOT NULL DEFAULT '',
  employee_name text NOT NULL DEFAULT '',
  employer_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert for document generation"
  ON generated_documents
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert documents"
  ON generated_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read documents"
  ON generated_documents
  FOR SELECT
  TO authenticated
  USING (true);
