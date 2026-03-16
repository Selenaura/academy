-- Add personal document fields to profiles for certificate issuance
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS document_type TEXT CHECK (document_type IN ('dni', 'nie', 'pasaporte'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS document_number TEXT;
