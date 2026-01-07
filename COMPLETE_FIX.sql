-- ========================================
-- COMPLETE FIX: Create Plans & Subscription
-- ========================================
-- Run this in PostgreSQL: psql -U postgres -d rpa_analyzer

-- Step 1: Create Subscription Plans
-- ========================================

-- Trial Plan
INSERT INTO subscription_plans (
    plan_id,
    name,
    description,
    price,
    billing_cycle,
    api_rate_limit,
    max_file_size_mb,
    max_analyses_per_month,
    features,
    is_active,
    created_at
)
VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,  -- Fixed UUID for trial
    'Trial',
    'Free trial for 30 days',
    0.00,
    'monthly',
    100,
    10,
    50,
    '{"support": "community", "api_access": true}'::json,
    true,
    NOW()
);

-- Basic Plan
INSERT INTO subscription_plans (
    plan_id,
    name,
    description,
    price,
    billing_cycle,
    api_rate_limit,
    max_file_size_mb,
    max_analyses_per_month,
    features,
    is_active,
    created_at
)
VALUES (
    '22222222-2222-2222-2222-222222222222'::uuid,  -- Fixed UUID for basic
    'Basic',
    'Perfect for individuals',
    29.00,
    'monthly',
    500,
    50,
    100,
    '{"support": "email", "api_access": true}'::json,
    true,
    NOW()
);

-- Professional Plan
INSERT INTO subscription_plans (
    plan_id,
    name,
    description,
    price,
    billing_cycle,
    api_rate_limit,
    max_file_size_mb,
    max_analyses_per_month,
    features,
    is_active,
    created_at
)
VALUES (
    '33333333-3333-3333-3333-333333333333'::uuid,  -- Fixed UUID for pro
    'Professional',
    'For growing teams',
    99.00,
    'monthly',
    5000,
    100,
    -1,  -- Unlimited
    '{"support": "priority", "api_access": true, "custom_rules": true}'::json,
    true,
    NOW()
);

-- Step 2: Verify Plans Were Created
-- ========================================
SELECT plan_id, name, price, billing_cycle FROM subscription_plans;

-- Step 3: Create Trial Subscription for Your User
-- ========================================
INSERT INTO subscriptions (
    subscription_id,
    user_id,
    plan_id,
    status,
    start_date,
    end_date,
    auto_renew,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid,  -- Your user_id
    '11111111-1111-1111-1111-111111111111'::uuid,  -- Trial plan_id
    'trial',
    NOW(),
    NOW() + INTERVAL '30 days',
    true,
    NOW(),
    NOW()
);

-- Step 4: Verify Subscription Was Created
-- ========================================
SELECT s.subscription_id, s.user_id, sp.name as plan_name, s.status, s.start_date, s.end_date
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.plan_id
WHERE s.user_id = 'da210db3-2c87-481e-beb7-31d9b3bff3bf'::uuid;

-- ========================================
-- DONE! Now go to Swagger and:
-- 1. Try GET /api/v1/subscription/plans (should show 3 plans)
-- 2. Try GET /api/v1/subscription/current (should show your trial)
-- 3. Try POST /api/v1/api_key to create API key
-- ========================================
