-- Admin function to insert reviews bypassing RLS
-- This allows admin dashboard to manually add reviews for any contractor

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
SECURITY DEFINER -- This runs with the privileges of the function owner (bypasses RLS)
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
  IF NOT EXISTS (SELECT 1 FROM contractors WHERE id = p_contractor_id) THEN
    RAISE EXCEPTION 'contractor with id % does not exist', p_contractor_id;
  END IF;
  
  -- Insert the review (bypasses RLS due to SECURITY DEFINER)
  INSERT INTO reviews (
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
    CASE WHEN trim(p_customer_email) = '' THEN NULL ELSE trim(p_customer_email) END,
    p_rating,
    CASE WHEN trim(p_comment) = '' THEN NULL ELSE trim(p_comment) END,
    p_verified,
    NOW()
  )
  RETURNING id INTO review_id;
  
  -- Update contractor's review statistics
  UPDATE contractors SET
    total_reviews = COALESCE(total_reviews, 0) + 1,
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews 
      WHERE contractor_id = p_contractor_id
    ),
    updated_at = NOW()
  WHERE id = p_contractor_id;
  
  RETURN review_id;
END;
$$;

-- Grant execute permission to authenticated users (admin should be authenticated)
GRANT EXECUTE ON FUNCTION admin_insert_review TO authenticated;

-- Optional: Create a more restrictive version that only admins can use
-- You would need to implement admin role checking in your app
COMMENT ON FUNCTION admin_insert_review IS 'Allows admin users to insert reviews for any contractor, bypassing RLS policies';
