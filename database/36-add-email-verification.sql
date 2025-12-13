-- Add email verification token fields to users table
-- Run this in your Supabase SQL Editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP WITH TIME ZONE;

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token) WHERE verification_token IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.verification_token IS 'Token used for email verification';
COMMENT ON COLUMN users.verification_token_expiry IS 'Expiration time for verification token (typically 24 hours)';
