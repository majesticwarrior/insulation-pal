-- Fix contractor contact information for notifications
-- This script ensures all contractors have contact_email and contact_phone populated

-- Update contractors to populate contact fields from their user record
UPDATE contractors 
SET 
    contact_email = COALESCE(contact_email, users.email),
    contact_phone = COALESCE(contact_phone, users.phone)
FROM users 
WHERE contractors.user_id = users.id 
AND (contractors.contact_email IS NULL OR contractors.contact_phone IS NULL);

-- Set default lead delivery preference if not set
UPDATE contractors 
SET lead_delivery_preference = 'email' 
WHERE lead_delivery_preference IS NULL;

-- Verify the updates
SELECT 
    c.id,
    c.business_name,
    c.contact_email,
    c.contact_phone,
    c.lead_delivery_preference,
    c.credits,
    c.status,
    u.email as user_email,
    u.phone as user_phone
FROM contractors c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.status = 'approved'
ORDER BY c.created_at DESC
LIMIT 10;
