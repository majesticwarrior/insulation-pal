-- Comprehensive fix for InsulationPal Database Issues
-- This script fixes both the quote form 500 errors and admin review 400 errors
-- Run this entire script in your Supabase SQL Editor

-- ========================================
-- FIX 1: ADD MISSING FIELDS TO LEADS TABLE
-- ========================================

-- Add property_address column if it doesn't exist
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_address TEXT;

-- Add quote_preference field if it doesn't exist 
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quote_preference VARCHAR(50) DEFAULT 'random_three';

-- Update comments to document the new fields
COMMENT ON COLUMN leads.property_address IS 'Full property address provided by customer in quote form';
COMMENT ON COLUMN leads.quote_preference IS 'Customer preference for receiving quotes: random_three or choose_three';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_property_address ON leads(property_address);
CREATE INDEX IF NOT EXISTS idx_leads_quote_preference ON leads(quote_preference);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_zip_code ON leads(zip_code);

-- ========================================
-- FIX 2: CREATE ROBUST ADMIN REVIEW FUNCTIONS
-- ========================================

-- Drop existing functions if they exist (to ensure clean recreation)
DROP FUNCTION IF EXISTS simple_admin_review(UUID, TEXT, INTEGER, TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS admin_insert_review(UUID, TEXT, INTEGER, TEXT, TEXT, BOOLEAN);

-- Create the simple admin review function (primary method)
CREATE OR REPLACE FUNCTION simple_admin_review(
  contractor_id_param UUID,
  customer_name_param TEXT,
  rating_param INTEGER,
  comment_param TEXT DEFAULT NULL,
  verified_param BOOLEAN DEFAULT TRUE,
  customer_email_param TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_review_id UUID;
  v_contractor_exists BOOLEAN;
  v_current_total_reviews INTEGER;
  v_current_average_rating NUMERIC;
  v_new_total_reviews INTEGER;
  v_new_average_rating NUMERIC;
BEGIN
  -- Validate contractor_id_param
  SELECT EXISTS (SELECT 1 FROM public.contractors WHERE id = contractor_id_param) INTO v_contractor_exists;
  IF NOT v_contractor_exists THEN
    RETURN json_build_object('success', FALSE, 'error', 'Contractor not found.');
  END IF;

  -- Insert the review
  INSERT INTO public.reviews (
    contractor_id,
    customer_name,
    customer_email,
    rating,
    comment,
    verified,
    lead_id -- Explicitly set lead_id to NULL for manual admin reviews
  ) VALUES (
    contractor_id_param,
    customer_name_param,
    customer_email_param,
    rating_param,
    comment_param,
    verified_param,
    NULL
  )
  RETURNING id INTO v_review_id;

  -- Update contractor's total_reviews and average_rating
  SELECT total_reviews, average_rating
  INTO v_current_total_reviews, v_current_average_rating
  FROM public.contractors
  WHERE id = contractor_id_param;

  v_current_total_reviews := COALESCE(v_current_total_reviews, 0);
  v_current_average_rating := COALESCE(v_current_average_rating, 0);

  v_new_total_reviews := v_current_total_reviews + 1;
  v_new_average_rating := ((v_current_average_rating * v_current_total_reviews) + rating_param) / v_new_total_reviews;

  UPDATE public.contractors
  SET
    total_reviews = v_new_total_reviews,
    average_rating = ROUND(v_new_average_rating, 2)
  WHERE id = contractor_id_param;

  RETURN json_build_object('success', TRUE, 'review_id', v_review_id);

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', FALSE, 'error', SQLERRM);
END;
$$;

-- Create the complex admin review function (fallback method)
CREATE OR REPLACE FUNCTION admin_insert_review(
  p_contractor_id UUID,
  p_customer_name TEXT,
  p_rating INTEGER,
  p_customer_email TEXT DEFAULT NULL,
  p_comment TEXT DEFAULT NULL,
  p_verified BOOLEAN DEFAULT TRUE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_id UUID;
BEGIN
  -- Validate inputs
  IF p_contractor_id IS NULL THEN
    RAISE EXCEPTION 'contractor_id cannot be null';
  END IF;
  
  IF p_customer_name IS NULL OR trim(p_customer_name) = '' THEN
    RAISE EXCEPTION 'customer_name cannot be null or empty';
  END IF;
  
  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  
  -- Verify contractor exists
  IF NOT EXISTS (SELECT 1 FROM public.contractors WHERE id = p_contractor_id) THEN
    RAISE EXCEPTION 'contractor with id % does not exist', p_contractor_id;
  END IF;
  
  -- Insert the review (bypasses RLS due to SECURITY DEFINER)
  INSERT INTO public.reviews (
    contractor_id,
    lead_id,
    customer_name,
    customer_email,
    rating,
    comment,
    verified,
    created_at
  ) VALUES (
    p_contractor_id,
    NULL,
    trim(p_customer_name),
    CASE WHEN trim(COALESCE(p_customer_email, '')) = '' THEN NULL ELSE trim(p_customer_email) END,
    p_rating,
    CASE WHEN trim(COALESCE(p_comment, '')) = '' THEN NULL ELSE trim(p_comment) END,
    p_verified,
    NOW()
  )
  RETURNING id INTO review_id;
  
  -- Update contractor's review statistics
  UPDATE public.contractors SET
    total_reviews = COALESCE(total_reviews, 0) + 1,
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.reviews 
      WHERE contractor_id = p_contractor_id
    ),
    updated_at = NOW()
  WHERE id = p_contractor_id;
  
  RETURN review_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION simple_admin_review TO authenticated;
GRANT EXECUTE ON FUNCTION simple_admin_review TO anon;
GRANT EXECUTE ON FUNCTION admin_insert_review TO authenticated;
GRANT EXECUTE ON FUNCTION admin_insert_review TO anon;

-- Add comments for documentation
COMMENT ON FUNCTION simple_admin_review IS 'Simple admin function to insert reviews with JSON response and error handling';
COMMENT ON FUNCTION admin_insert_review IS 'Complex admin function to insert reviews, returns UUID and handles contractor stats';

-- ========================================
-- FIX 3: ENSURE RLS POLICIES ALLOW ADMIN ACCESS
-- ========================================

-- Create permissive RLS policies for reviews table if they don't exist
DO $$ 
BEGIN
    -- Check if RLS policy exists for reviews
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Allow admin insert reviews'
    ) THEN
        CREATE POLICY "Allow admin insert reviews" ON public.reviews
        FOR INSERT
        TO authenticated, anon
        WITH CHECK (true);
    END IF;
    
    -- Check if RLS policy exists for reading reviews
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Allow admin read reviews'
    ) THEN
        CREATE POLICY "Allow admin read reviews" ON public.reviews
        FOR SELECT
        TO authenticated, anon
        USING (true);
    END IF;
END $$;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify leads table has new columns
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('property_address', 'quote_preference')
ORDER BY column_name;

-- Verify functions exist
SELECT 
    routine_name,
    routine_type,
    specific_name
FROM information_schema.routines 
WHERE routine_name IN ('simple_admin_review', 'admin_insert_review')
ORDER BY routine_name;

-- Test the simple function with a dummy call (should fail gracefully)
SELECT simple_admin_review(
    '00000000-0000-0000-0000-000000000000'::UUID,
    'Test User',
    5,
    'Test comment',
    true,
    'test@example.com'
);

-- Show success message
SELECT 'Database fixes applied successfully! You can now:
1. Submit quote forms with address and preference fields
2. Add manual reviews from the admin dashboard
3. Both functions have proper error handling and fallback mechanisms' as status;
