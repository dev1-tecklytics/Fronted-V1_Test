import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Check as CheckIcon,
    Star as StarIcon,
    Rocket as RocketIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { subscriptionAPI } from '../services/api';

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '80px 24px',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    color: '#ffffff',
    fontSize: '3.5rem',
    textAlign: 'center',
    marginBottom: '16px',
    [theme.breakpoints.down('md')]: {
        fontSize: '2.5rem',
    },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '1.25rem',
    textAlign: 'center',
    marginBottom: '64px',
    maxWidth: '600px',
    margin: '0 auto 64px',
}));

const PricingCard = styled(Card)(({ theme, featured }) => ({
    position: 'relative',
    borderRadius: '24px',
    padding: '40px 32px',
    height: '100%',
    transition: 'all 0.3s ease',
    border: featured ? '3px solid #ffd700' : '1px solid #e0e0e0',
    transform: featured ? 'scale(1.05)' : 'scale(1)',
    boxShadow: featured
        ? '0 20px 60px rgba(0, 0, 0, 0.3)'
        : '0 10px 30px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        transform: featured ? 'scale(1.08)' : 'scale(1.03)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
}));

const FeaturedBadge = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: '-12px',
    right: '24px',
    background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)',
    color: '#000',
    fontWeight: 700,
    fontSize: '12px',
    padding: '4px 8px',
}));

const PlanIcon = styled(Box)(({ theme, color }) => ({
    width: 64,
    height: 64,
    borderRadius: '16px',
    background: color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
}));

const Price = styled(Typography)(({ theme }) => ({
    fontSize: '3.5rem',
    fontWeight: 800,
    color: '#212121',
    marginBottom: '8px',
}));

const PriceUnit = styled('span')(({ theme }) => ({
    fontSize: '1.5rem',
    fontWeight: 400,
    color: '#757575',
}));

const SubscribeButton = styled(Button)(({ theme, featured }) => ({
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 700,
    marginTop: '24px',
    background: featured
        ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
        : '#212121',
    color: '#ffffff',
    '&:hover': {
        background: featured
            ? 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)'
            : '#424242',
        transform: 'translateY(-2px)',
    },
    transition: 'all 0.2s ease',
}));

const FeatureItem = styled(ListItem)(({ theme }) => ({
    padding: '8px 0',
}));

const PricingPage = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await subscriptionAPI.getPlans();
            setPlans(data);
        } catch (error) {
            console.error('Failed to fetch plans:', error);
            // Use default plans if API fails
            setPlans(getDefaultPlans());
        } finally {
            setLoading(false);
        }
    };

    const getDefaultPlans = () => [
        {
            plan_id: 'basic',
            plan_name: 'Basic',
            description: 'Perfect for individuals and small teams',
            price: 29,
            billing_cycle: 'monthly',
            features: [
                '100 workflow analyses per month',
                'Basic code review',
                'Email support',
                '1 user',
                'Community access',
            ],
            is_featured: false,
        },
        {
            plan_id: 'pro',
            plan_name: 'Professional',
            description: 'For growing teams and businesses',
            price: 99,
            billing_cycle: 'monthly',
            features: [
                'Unlimited workflow analyses',
                'Advanced code review',
                'Priority support',
                'Up to 10 users',
                'Custom rules',
                'API access',
                'Advanced analytics',
            ],
            is_featured: true,
        },
        {
            plan_id: 'enterprise',
            plan_name: 'Enterprise',
            description: 'For large organizations',
            price: 299,
            billing_cycle: 'monthly',
            features: [
                'Everything in Pro',
                'Unlimited users',
                'Dedicated support',
                'SLA guarantee',
                'Custom integrations',
                'On-premise deployment',
                'Training & onboarding',
            ],
            is_featured: false,
        },
    ];

    const handleSubscribe = async (planId) => {
        setSubscribing(planId);
        try {
            await subscriptionAPI.subscribe(planId);
            setSnackbar({
                open: true,
                message: 'Successfully subscribed! Redirecting...',
                severity: 'success',
            });
            setTimeout(() => {
                navigate('/subscription');
            }, 2000);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to subscribe. Please try again.',
                severity: 'error',
            });
        } finally {
            setSubscribing(null);
        }
    };

    const getPlanIcon = (planName) => {
        switch (planName.toLowerCase()) {
            case 'basic':
                return <StarIcon sx={{ fontSize: 32, color: '#ffffff' }} />;
            case 'professional':
            case 'pro':
                return <RocketIcon sx={{ fontSize: 32, color: '#ffffff' }} />;
            case 'enterprise':
                return <BusinessIcon sx={{ fontSize: 32, color: '#ffffff' }} />;
            default:
                return <StarIcon sx={{ fontSize: 32, color: '#ffffff' }} />;
        }
    };

    const getPlanColor = (planName) => {
        switch (planName.toLowerCase()) {
            case 'basic':
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            case 'professional':
            case 'pro':
                return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            case 'enterprise':
                return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            default:
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress sx={{ color: '#ffffff' }} size={60} />
                    </Box>
                </Container>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <Title>Choose Your Plan</Title>
                <Subtitle>
                    Start analyzing your automation workflows today. Upgrade or downgrade anytime.
                </Subtitle>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 4,
                    alignItems: 'stretch',
                }}>
                    {plans.map((plan) => (
                        <PricingCard key={plan.plan_id} featured={plan.is_featured}>
                            {plan.is_featured && (
                                <FeaturedBadge label="MOST POPULAR" icon={<StarIcon sx={{ fontSize: 16 }} />} />
                            )}

                            <PlanIcon color={getPlanColor(plan.plan_name)}>
                                {getPlanIcon(plan.plan_name)}
                            </PlanIcon>

                            <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: '8px' }}>
                                {plan.plan_name}
                            </Typography>

                            <Typography sx={{ color: '#757575', marginBottom: '24px', minHeight: '48px' }}>
                                {plan.description}
                            </Typography>

                            <Box sx={{ marginBottom: '24px' }}>
                                <Price>
                                    ${plan.price}
                                    <PriceUnit>/month</PriceUnit>
                                </Price>
                            </Box>

                            <List sx={{ marginBottom: '24px' }}>
                                {plan.features.map((feature, index) => (
                                    <FeatureItem key={index} disablePadding>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={feature}
                                            primaryTypographyProps={{
                                                fontSize: '14px',
                                                color: '#424242',
                                            }}
                                        />
                                    </FeatureItem>
                                ))}
                            </List>

                            <SubscribeButton
                                featured={plan.is_featured}
                                onClick={() => handleSubscribe(plan.plan_id)}
                                disabled={subscribing === plan.plan_id}
                            >
                                {subscribing === plan.plan_id ? (
                                    <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                                ) : (
                                    'Get Started'
                                )}
                            </SubscribeButton>
                        </PricingCard>
                    ))}
                </Box>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
};

export default PricingPage;
