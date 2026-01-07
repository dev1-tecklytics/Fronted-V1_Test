-- Create Trial Subscription for User
-- Run this in PostgreSQL

-- First, verify your user exists
SELECT user_id, email, full_name FROM users WHERE email = 'Demo@example.com';

-- Create trial subscription
INSERT INTO subscriptions (
    subscription_id,
    user_id,
    plan_name,
    status,
    billing_cycle,
    start_date,
    end_date,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'da210db3-2c87-481e-beb7-31d9b3bff3bf',  -- Your user_id
    'Trial',
    'trial',
    'monthly',
    NOW(),
    NOW() + INTERVAL '30 days',
    NOW(),
    NOW()
);

-- Verify subscription was created
SELECT * FROM subscriptions WHERE user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf';
