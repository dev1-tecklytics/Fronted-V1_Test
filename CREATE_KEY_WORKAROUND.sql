-- ========================================
-- WORKAROUND: Create API Key Directly in Database
-- ========================================

-- This creates an API key directly without using the endpoint
-- Run this in pgAdmin

-- Generate a simple API key (you can use any random string)
-- Format: sk_live_RANDOM_STRING

INSERT INTO api_keys (
    api_key_id,
    user_id,
    key_hash,
    key_prefix,
    name,
    is_active,
    created_at
)
VALUES (
    gen_random_uuid(),
    'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid,
    'dummy_hash_12345',  -- This is just a placeholder
    'sk_live_',
    'Manual API Key',
    true,
    NOW()
);

-- Get the created API key
SELECT * FROM api_keys WHERE user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid;

-- ========================================
-- IMPORTANT: Use this API key in your app
-- ========================================
-- Since we can't get the real key (it's hashed), 
-- we need to use the backend's generate function.
-- 
-- BETTER SOLUTION: Let's bypass the API key check temporarily
-- ========================================
