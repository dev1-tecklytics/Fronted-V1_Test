-- Create Subscription Plans in Database
-- Run this in PostgreSQL (psql -U postgres -d rpa_analyzer)

-- Insert Basic Plan
INSERT INTO subscription_plans (
    plan_id,
    plan_name,
    description,
    price,
    billing_cycle,
    features,
    is_active,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'Basic',
    'Perfect for individuals and small teams',
    29.00,
    'monthly',
    '{"analyses_limit": 100, "users_limit": 1, "support": "email"}',
    true,
    NOW(),
    NOW()
);

-- Insert Professional Plan
INSERT INTO subscription_plans (
    plan_id,
    plan_name,
    description,
    price,
    billing_cycle,
    features,
    '{"analyses_limit": -1, "users_limit": 10, "support": "priority", "api_access": true}',
    is_active,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'Professional',
    'For growing teams and businesses',
    99.00,
    'monthly',
    '{"analyses_limit": -1, "users_limit": 10, "support": "priority", "api_access": true}',
    true,
    NOW(),
    NOW()
);

-- Insert Trial Plan
INSERT INTO subscription_plans (
    plan_id,
    plan_name,
    description,
    price,
    billing_cycle,
    features,
    is_active,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'Trial',
    'Free trial for 30 days',
    0.00,
    'monthly',
    '{"analyses_limit": 50, "users_limit": 1, "support": "community"}',
    true,
    NOW(),
    NOW()
);

-- Verify plans were created
SELECT plan_id, plan_name, price FROM subscription_plans;
