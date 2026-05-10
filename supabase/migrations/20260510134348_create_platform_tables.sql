/*
  # Labor Shield Platform Tables

  1. New Tables
    - `ai_chat_queries` — anonymized AI queries for learning loop
      - `id` (uuid, pk)
      - `query` (text) — user question
      - `response` (text) — AI answer
      - `language` (text) — en/th/ru
      - `created_at` (timestamptz)

    - `evidence_locker` — secure user evidence uploads
      - `id` (uuid, pk)
      - `user_email` (text) — submitter email
      - `file_name` (text)
      - `file_url` (text) — Supabase storage URL
      - `file_type` (text) — screenshot/payslip/contract/other
      - `notes` (text)
      - `timestamp_hash` (text) — SHA hash for tamper evidence
      - `created_at` (timestamptz)

    - `premium_payments` — payment verification records
      - `id` (uuid, pk)
      - `email` (text)
      - `amount` (integer) — THB
      - `plan` (text) — expat/thai
      - `receipt_url` (text)
      - `verified` (boolean)
      - `created_at` (timestamptz)

  2. Security — RLS enabled on all tables
*/

-- AI chat queries (anonymized, allow anon insert for learning loop)
CREATE TABLE IF NOT EXISTS ai_chat_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL DEFAULT '',
  response text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_chat_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert for AI queries"
  ON ai_chat_queries FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert for AI queries"
  ON ai_chat_queries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read of AI queries"
  ON ai_chat_queries FOR SELECT
  TO authenticated
  USING (true);

-- Evidence locker
CREATE TABLE IF NOT EXISTS evidence_locker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  file_type text NOT NULL DEFAULT 'other',
  notes text NOT NULL DEFAULT '',
  timestamp_hash text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE evidence_locker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert for evidence"
  ON evidence_locker FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert for evidence"
  ON evidence_locker FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read evidence"
  ON evidence_locker FOR SELECT
  TO authenticated
  USING (true);

-- Premium payments
CREATE TABLE IF NOT EXISTS premium_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL DEFAULT '',
  amount integer NOT NULL DEFAULT 0,
  plan text NOT NULL DEFAULT 'expat',
  receipt_url text NOT NULL DEFAULT '',
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE premium_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert premium payment"
  ON premium_payments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert premium payment"
  ON premium_payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read premium payments"
  ON premium_payments FOR SELECT
  TO authenticated
  USING (true);
