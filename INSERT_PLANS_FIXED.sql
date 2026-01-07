-- ========================================
-- CORRECTED: Insert Plans with UPPERCASE enums
-- ========================================

-- Trial Plan
INSERT INTO subscription_plans (plan_id, name, description, price, billing_cycle, api_rate_limit, max_file_size_mb, max_analyses_per_month, features, is_active, created_at)
VALUES ('11111111-1111-1111-1111-111111111111'::uuid, 'Trial', 'Free trial for 30 days', 0.00, 'MONTHLY', 100, 10, 50, '{"support": "community", "api_access": true}'::json, true, NOW());

-- Basic Plan
INSERT INTO subscription_plans (plan_id, name, description, price, billing_cycle, api_rate_limit, max_file_size_mb, max_analyses_per_month, features, is_active, created_at)
VALUES ('22222222-2222-2222-2222-222222222222'::uuid, 'Basic', 'Perfect for individuals', 29.00, 'MONTHLY', 500, 50, 100, '{"support": "email", "api_access": true}'::json, true, NOW());

-- Professional Plan
INSERT INTO subscription_plans (plan_id, name, description, price, billing_cycle, api_rate_limit, max_file_size_mb, max_analyses_per_month, features, is_active, created_at)
VALUES ('33333333-3333-3333-3333-333333333333'::uuid, 'Professional', 'For growing teams', 99.00, 'MONTHLY', 5000, 100, -1, '{"support": "priority", "api_access": true}'::json, true, NOW());

-- Verify
SELECT * FROM subscription_plans;
