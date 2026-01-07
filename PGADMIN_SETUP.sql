-- ========================================
-- COMPLETE SETUP: Plans + Subscription
-- Run these commands one by one in pgAdmin
-- ========================================

-- STEP 1: Insert Plans
-- ========================================

INSERT INTO subscription_plans (plan_id, name, description, price, billing_cycle, api_rate_limit, max_file_size_mb, max_analyses_per_month, features, is_active, created_at)
VALUES ('11111111-1111-1111-1111-111111111111'::uuid, 'Trial', 'Free trial for 30 days', 0.00, 'monthly', 100, 10, 50, '{"support": "community", "api_access": true}'::json, true, NOW());

INSERT INTO subscription_plans (plan_id, name, description, price, billing_cycle, api_rate_limit, max_file_size_mb, max_analyses_per_month, features, is_active, created_at)
VALUES ('22222222-2222-2222-2222-222222222222'::uuid, 'Basic', 'Perfect for individuals', 29.00, 'monthly', 500, 50, 100, '{"support": "email", "api_access": true}'::json, true, NOW());

INSERT INTO subscription_plans (plan_id, name, description, price, billing_cycle, api_rate_limit, max_file_size_mb, max_analyses_per_month, features, is_active, created_at)
VALUES ('33333333-3333-3333-3333-333333333333'::uuid, 'Professional', 'For growing teams', 99.00, 'monthly', 5000, 100, -1, '{"support": "priority", "api_access": true}'::json, true, NOW());

-- STEP 2: Verify Plans
-- ========================================

SELECT * FROM subscription_plans;

-- STEP 3: Insert Trial Subscription for Your User
-- ========================================

INSERT INTO subscriptions (subscription_id, user_id, plan_id, status, start_date, end_date, auto_renew, created_at, updated_at)
VALUES (gen_random_uuid(), 'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'trial', NOW(), NOW() + INTERVAL '30 days', true, NOW(), NOW());

-- STEP 4: Verify Subscription
-- ========================================

SELECT s.*, sp.name as plan_name 
FROM subscriptions s 
JOIN subscription_plans sp ON s.plan_id = sp.plan_id 
WHERE s.user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid;

-- ========================================
-- DONE! Now:
-- 1. Refresh Swagger (F5)
-- 2. Try GET /api/v1/subscription/plans
-- 3. Try GET /api/v1/subscription/current
-- 4. Try POST /api/v1/api_key
-- ========================================
