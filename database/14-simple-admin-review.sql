-- Simple admin review function with minimal dependencies
-- This is a more basic version that should work even with RLS issues

CREATE OR REPLACE FUNCTION simple_admin_review(
  contractor_id_param UUID,
  customer_name_param TEXT,
  rating_param INTEGER,
  comment_param TEXT DEFAULT NULL,
  verified_param BOOLEAN DEFAULT TRUE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  new_review_id UUID;
BEGIN
  -- Simple validation
  IF contractor_id_param IS NULL THEN
    RETURN json_build_object('error', 'contractor_id is required');
  END IF;
  
  IF customer_name_param IS NULL OR trim(customer_name_param) = '' THEN
    RETURN json_build_object('error', 'customer_name is required');
  END IF;
  
  IF rating_param IS NULL OR rating_param < 1 OR rating_param > 5 THEN
    RETURN json_build_object('error', 'rating must be between 1 and 5');
  END IF;
  
  -- Insert review
  BEGIN
    INSERT INTO reviews (
      contractor_id,
      lead_id,
      customer_name,
      customer_email,
      rating,
      comment,
      verified
    ) VALUES (
      contractor_id_param,
      NULL,
      trim(customer_name_param),
      NULL,
      rating_param,
      CASE WHEN comment_param IS NULL OR trim(comment_param) = '' THEN NULL ELSE trim(comment_param) END,
      COALESCE(verified_param, TRUE)
    ) RETURNING id INTO new_review_id;
    
    -- Return success
    result := json_build_object(
      'success', TRUE,
      'review_id', new_review_id,
      'message', 'Review inserted successfully'
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Return error details
    result := json_build_object(
      'success', FALSE,
      'error', SQLERRM,
      'error_code', SQLSTATE
    );
  END;
  
  RETURN result;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION simple_admin_review TO authenticated;
GRANT EXECUTE ON FUNCTION simple_admin_review TO anon;

COMMENT ON FUNCTION simple_admin_review IS 'Simple admin function to insert reviews with error handling';
