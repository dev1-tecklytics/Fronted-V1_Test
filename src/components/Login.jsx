import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Link,
    Avatar,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Shield as ShieldIcon,
    ArrowForward,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { apiKeyAPI } from '../services/api';

// Styled components with modern aesthetics
const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 460,
    width: '100%',
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
    background: '#ffffff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.12)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '30px 20px',
        maxWidth: '95%',
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 70,
    height: 70,
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #5e6ff2 0%, #9d4edd 100%)',
    boxShadow: '0 8px 24px rgba(94, 111, 242, 0.3)',
    animation: 'pulse 2s ease-in-out infinite',
    '@keyframes pulse': {
        '0%, 100%': {
            transform: 'scale(1)',
        },
        '50%': {
            transform: 'scale(1.05)',
        },
    },
    [theme.breakpoints.down('sm')]: {
        width: 60,
        height: 60,
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#fafafa',
        transition: 'all 0.3s ease',
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
        '&:hover fieldset': {
            borderColor: '#5e6ff2',
        },
        '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 3px rgba(94, 111, 242, 0.1)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#5e6ff2',
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        fontWeight: 500,
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
    borderRadius: '12px',
    padding: '14px 28px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    boxShadow: '0 8px 24px rgba(94, 111, 242, 0.35)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(90deg, #4c5ed7 0%, #8939c9 100%)',
        boxShadow: '0 12px 32px rgba(94, 111, 242, 0.45)',
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '12px 24px',
        fontSize: '15px',
    },
}));

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Dummy user database
    const dummyUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
        { id: 3, name: 'Admin User', email: 'admin@iaap.com', password: 'admin123' },
    ];

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.password) {
            setSnackbarMessage('❌ Please fill in all fields');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
            console.log('🔐 Attempting login...');
            console.log('📍 API URL:', apiUrl);
            console.log('📧 Email:', formData.email);

            // Call real backend API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            console.log('📡 Response:', response);

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (!response.ok) {
                // Handle different error statuses
                if (response.status === 404) {
                    throw new Error('Login endpoint not found. Please check backend configuration.');
                } else if (response.status === 401) {
                    throw new Error('Invalid email or password');
                } else if (response.status === 422) {
                    throw new Error(data.detail?.[0]?.msg || 'Invalid input format');
                } else {
                    throw new Error(data.detail || data.message || `Error: ${response.status}`);
                }
            }

            console.log('✅ Login successful:', data);

            // Store token and user data from backend response
            // Backend returns: { access_token, token_type, user: { email, full_name, user_id } }
            if (data.access_token) {
                localStorage.setItem('authToken', data.access_token);
                console.log('🔑 Token stored:', data.access_token.substring(0, 20) + '...');
            }

            if (data.user) {
                // Store complete user object
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('userId', data.user.user_id);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userFullName', data.user.full_name);
                console.log('👤 User data stored:', data.user);
            }

            // Auto-create API key if not exists
            try {
                let apiKey = localStorage.getItem('apiKey');

                if (!apiKey) {
                    console.log('🔑 No API key found. Creating one...');
                    const keyResponse = await apiKeyAPI.create('Auto-generated on Login');
                    apiKey = keyResponse.api_key;
                    localStorage.setItem('apiKey', apiKey);
                    localStorage.setItem('apiKeyName', keyResponse.name || 'Auto-generated on Login');
                    console.log('✅ API key created and stored');
                } else {
                    console.log('✅ API key already exists');
                }
            } catch (keyError) {
                console.warn('⚠️ Could not create API key:', keyError);
                // Don't block login if API key creation fails
            }

            setSnackbarMessage(`✅ Welcome back, ${data.user?.full_name || data.user?.email || 'User'}!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                console.log('🚀 Redirecting to dashboard...');
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });

            setSnackbarMessage(`❌ ${error.message || 'Login failed. Please try again.'}`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { xs: '10px', sm: '20px' },
            }}
        >
            <StyledCard>
                <CardContent sx={{ padding: 0 }}>
                    {/* Logo/Icon */}
                    <StyledAvatar>
                        <ShieldIcon sx={{ fontSize: { xs: 30, sm: 35 }, color: '#ffffff' }} />
                    </StyledAvatar>

                    {/* Title */}
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px',
                            fontSize: { xs: '1.75rem', sm: '2.125rem' },
                        }}
                    >
                        Welcome to IAAP
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            color: '#757575',
                            marginBottom: '40px',
                            fontSize: { xs: '14px', sm: '15px' },
                            px: { xs: 1, sm: 0 },
                        }}
                    >
                        Intelligent Automation Analysis Platform
                    </Typography>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Email Field */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#212121',
                                        fontSize: { xs: '13px', sm: '14px' },
                                    }}
                                >
                                    Email
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            {/* Password Field */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#212121',
                                    }}
                                >
                                    Password
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                    sx={{ color: '#9e9e9e' }}
                                                >
                                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            {/* Sign In Button */}
                            <GradientButton
                                fullWidth
                                type="submit"
                                endIcon={<ArrowForward />}
                                sx={{ marginTop: '8px' }}
                            >
                                Sign In
                            </GradientButton>
                        </Box>
                    </form>

                    {/* Sign Up Link */}
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            marginTop: '24px',
                            color: '#757575',
                        }}
                    >
                        Don't have an account?{' '}
                        <Link
                            onClick={() => navigate('/signup')}
                            component="button"
                            type="button"
                            underline="none"
                            sx={{
                                color: '#5e6ff2',
                                fontWeight: 600,
                                transition: 'color 0.2s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: '#9d4edd',
                                },
                            }}
                        >
                            Sign up
                        </Link>
                    </Typography>
                </CardContent>
            </StyledCard>

            {/* Snackbar for notifications */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;
