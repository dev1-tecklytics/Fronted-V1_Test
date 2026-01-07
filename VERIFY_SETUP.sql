-- Verify Everything is Set Up Correctly
-- Run these queries in pgAdmin to check

-- 1. Check your user exists
SELECT user_id, email, full_name, status FROM users WHERE email = 'Demo@example.com';

-- 2. Check subscription plans exist
SELECT plan_id, name, price, billing_cycle FROM subscription_plans;

-- 3. Check your subscription exists
SELECT s.subscription_id, s.user_id, s.status, sp.name as plan_name, s.start_date, s.end_date
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.plan_id
WHERE s.user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid;

-- 4. Check if subscription is active (status should be TRIAL or ACTIVE)
SELECT * FROM subscriptions WHERE user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid AND status IN ('TRIAL', 'ACTIVE');

-- If the last query returns empty, your subscription might have wrong status
-- Fix it with:
UPDATE subscriptions 
SET status = 'TRIAL'
WHERE user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid;
