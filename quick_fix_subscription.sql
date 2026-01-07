-- QUICK FIX: Create Trial Subscription Directly
-- Run this in PostgreSQL: psql -U postgres -d rpa_analyzer

-- Create trial subscription for your user
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
    'da210db3-2c87-481e-beb7-31d9b3bff3bf',  -- Your user_id from login
    'Trial',
    'trial',
    'monthly',
    NOW(),
    NOW() + INTERVAL '30 days',
    NOW(),
    NOW()
);

-- Verify subscription was created
SELECT subscription_id, user_id, plan_name, status, start_date, end_date 
FROM subscriptions 
WHERE user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf';

-- If successful, you should see your subscription!
-- Now go back to Swagger and try creating the API key again.
