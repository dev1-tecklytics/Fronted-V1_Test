import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    LinearProgress,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    TrendingUp as TrendingIcon,
    CalendarToday as CalendarIcon,
    CreditCard as CardIcon,
    Cancel as CancelIcon,
    Upgrade as UpgradeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { subscriptionAPI } from '../services/api';

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '24px',
}));

const Header = styled(Box)(({ theme }) => ({
    marginBottom: '32px',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '2.5rem',
    marginBottom: '8px',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    marginBottom: '24px',
}));

const StatusBadge = styled(Chip)(({ theme, status }) => {
    const colors = {
        active: { bg: '#e8f5e9', color: '#2e7d32' },
        trial: { bg: '#fff3e0', color: '#e65100' },
        cancelled: { bg: '#ffebee', color: '#c62828' },
        expired: { bg: '#f5f5f5', color: '#616161' },
    };
    const style = colors[status] || colors.active;
    return {
        background: style.bg,
        color: style.color,
        fontWeight: 700,
        fontSize: '14px',
        padding: '8px 16px',
    };
});

const UsageCard = styled(Box)(({ theme }) => ({
    padding: '24px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    marginBottom: '16px',
}));

const UsageBar = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    '& .MuiLinearProgress-bar': {
        borderRadius: 6,
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
}));

const ActionButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
    padding: '12px 24px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    ...(buttonVariant === 'upgrade' && {
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        '&:hover': {
            background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
        },
    }),
    ...(buttonVariant === 'cancel' && {
        border: '1px solid #f44336',
        color: '#f44336',
        '&:hover': {
            background: '#ffebee',
        },
    }),
}));

const MySubscription = () => {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelDialog, setCancelDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const fetchSubscriptionData = async () => {
        try {
            const [subData, usageData] = await Promise.all([
                subscriptionAPI.getCurrent(),
                subscriptionAPI.getUsage(),
            ]);
            setSubscription(subData);
            setUsage(usageData);
        } catch (error) {
            console.error('Failed to fetch subscription:', error);
            // Use mock data for demo
            setSubscription({
                plan_name: 'Professional',
                status: 'active',
                billing_cycle: 'monthly',
                start_date: '2026-01-01',
                end_date: '2026-02-01',
                price: 99,
            });
            setUsage({
                analyses_used: 450,
                analyses_limit: 1000,
                api_calls_used: 2340,
                api_calls_limit: 10000,
                storage_used: 1.2,
                storage_limit: 10,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            await subscriptionAPI.cancel();
            setSnackbar({
                open: true,
                message: 'Subscription cancelled successfully',
                severity: 'success',
            });
            setCancelDialog(false);
            fetchSubscriptionData();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to cancel subscription',
                severity: 'error',
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getUsagePercentage = (used, limit) => {
        return Math.min((used / limit) * 100, 100);
    };

    const getUsageColor = (percentage) => {
        if (percentage >= 90) return '#f44336';
        if (percentage >= 70) return '#ff9800';
        return '#4caf50';
    };

    if (loading) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress size={60} />
                    </Box>
                </Container>
            </PageContainer>
        );
    }

    if (!subscription) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <StyledCard>
                        <Typography variant="h5" sx={{ marginBottom: '16px', fontWeight: 700 }}>
                            No Active Subscription
                        </Typography>
                        <Typography sx={{ color: '#757575', marginBottom: '24px' }}>
                            You don't have an active subscription. Choose a plan to get started.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/pricing')}
                            sx={{
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
                                },
                            }}
                        >
                            View Plans
                        </Button>
                    </StyledCard>
                </Container>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <Header>
                    <Title>My Subscription</Title>
                    <Typography sx={{ color: '#757575', fontSize: '16px' }}>
                        Manage your subscription and monitor usage
                    </Typography>
                </Header>

                {/* Subscription Details */}
                <StyledCard>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: '8px' }}>
                                {subscription.plan_name} Plan
                            </Typography>
                            <StatusBadge
                                label={subscription.status.toUpperCase()}
                                status={subscription.status}
                            />
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
                            ${subscription.price}
                            <Typography component="span" sx={{ fontSize: '1rem', color: '#757575' }}>
                                /{subscription.billing_cycle}
                            </Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, marginBottom: '24px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CalendarIcon sx={{ color: '#667eea', fontSize: 24 }} />
                            <Box>
                                <Typography sx={{ fontSize: '12px', color: '#757575' }}>Start Date</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{formatDate(subscription.start_date)}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CalendarIcon sx={{ color: '#667eea', fontSize: 24 }} />
                            <Box>
                                <Typography sx={{ fontSize: '12px', color: '#757575' }}>Next Billing Date</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{formatDate(subscription.end_date)}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <ActionButton
                            variant="upgrade"
                            startIcon={<UpgradeIcon />}
                            onClick={() => navigate('/pricing')}
                        >
                            Upgrade Plan
                        </ActionButton>
                        <ActionButton
                            variant="cancel"
                            startIcon={<CancelIcon />}
                            onClick={() => setCancelDialog(true)}
                        >
                            Cancel Subscription
                        </ActionButton>
                    </Box>
                </StyledCard>

                {/* Usage Statistics */}
                <StyledCard>
                    <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: '24px' }}>
                        Usage This Month
                    </Typography>

                    {usage && (
                        <>
                            {/* Workflow Analyses */}
                            <UsageCard>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <Typography sx={{ fontWeight: 600 }}>Workflow Analyses</Typography>
                                    <Typography sx={{ color: '#757575' }}>
                                        {usage.analyses_used} / {usage.analyses_limit}
                                    </Typography>
                                </Box>
                                <UsageBar
                                    variant="determinate"
                                    value={getUsagePercentage(usage.analyses_used, usage.analyses_limit)}
                                />
                                <Typography sx={{ fontSize: '12px', color: '#757575', marginTop: '8px' }}>
                                    {Math.round(getUsagePercentage(usage.analyses_used, usage.analyses_limit))}% used
                                </Typography>
                            </UsageCard>

                            {/* API Calls */}
                            <UsageCard>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <Typography sx={{ fontWeight: 600 }}>API Calls</Typography>
                                    <Typography sx={{ color: '#757575' }}>
                                        {usage.api_calls_used.toLocaleString()} / {usage.api_calls_limit.toLocaleString()}
                                    </Typography>
                                </Box>
                                <UsageBar
                                    variant="determinate"
                                    value={getUsagePercentage(usage.api_calls_used, usage.api_calls_limit)}
                                />
                                <Typography sx={{ fontSize: '12px', color: '#757575', marginTop: '8px' }}>
                                    {Math.round(getUsagePercentage(usage.api_calls_used, usage.api_calls_limit))}% used
                                </Typography>
                            </UsageCard>

                            {/* Storage */}
                            <UsageCard>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <Typography sx={{ fontWeight: 600 }}>Storage</Typography>
                                    <Typography sx={{ color: '#757575' }}>
                                        {usage.storage_used} GB / {usage.storage_limit} GB
                                    </Typography>
                                </Box>
                                <UsageBar
                                    variant="determinate"
                                    value={getUsagePercentage(usage.storage_used, usage.storage_limit)}
                                />
                                <Typography sx={{ fontSize: '12px', color: '#757575', marginTop: '8px' }}>
                                    {Math.round(getUsagePercentage(usage.storage_used, usage.storage_limit))}% used
                                </Typography>
                            </UsageCard>
                        </>
                    )}
                </StyledCard>

                {/* Cancel Dialog */}
                <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
                    <DialogTitle>Cancel Subscription?</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCancelDialog(false)}>Keep Subscription</Button>
                        <Button onClick={handleCancelSubscription} color="error" variant="contained">
                            Cancel Subscription
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
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
            </Container>
        </PageContainer>
    );
};

export default MySubscription;
