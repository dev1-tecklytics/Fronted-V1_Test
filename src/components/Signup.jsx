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
    Person as PersonIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Dummy user database (in-memory)
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
    ]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setSnackbarMessage('❌ Please fill in all fields');
            setOpenSnackbar(true);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setSnackbarMessage('❌ Passwords do not match');
            setOpenSnackbar(true);
            return;
        }

        if (formData.password.length < 6) {
            setSnackbarMessage('❌ Password must be at least 6 characters');
            setOpenSnackbar(true);
            return;
        }

        try {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/register`;
            console.log('📝 Attempting signup...');
            console.log('📍 API URL:', apiUrl);
            console.log('📧 Email:', formData.email);
            console.log('👤 Name:', formData.name);

            // Call real backend API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (!response.ok) {
                // Handle different error statuses
                if (response.status === 404) {
                    throw new Error('Register endpoint not found. Please check backend configuration.');
                } else if (response.status === 400) {
                    throw new Error(data.detail || 'Email already registered');
                } else if (response.status === 422) {
                    throw new Error(data.detail?.[0]?.msg || 'Invalid input format');
                } else {
                    throw new Error(data.detail || data.message || `Error: ${response.status}`);
                }
            }

            console.log('✅ Signup successful:', data);

            // Store token and user data
            if (data.access_token) {
                const apiKey = data.api_key_prefix + " : " + data.api_key_hash;
                localStorage.setItem('authToken', data.access_token);
                localStorage.setItem('apiKey', apiKey);
                console.log('🔑 Token stored');
            }
            localStorage.setItem('currentUser', JSON.stringify(data.user || data));
            console.log('👤 User data stored');

            setSnackbarMessage('✅ Account created successfully! Redirecting to dashboard...');
            setOpenSnackbar(true);

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                console.log('🚀 Redirecting to dashboard...');
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('❌ Signup error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack
            });

            setSnackbarMessage(`❌ ${error.message || 'Registration failed. Please try again.'}`);
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
                        Join IAAP
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            color: '#757575',
                            marginBottom: '30px',
                            fontSize: { xs: '14px', sm: '15px' },
                            px: { xs: 1, sm: 0 },
                        }}
                    >
                        Create your account to get started
                    </Typography>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Name Field */}
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
                                    Full Name
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

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
                                        fontSize: { xs: '13px', sm: '14px' },
                                    }}
                                >
                                    Password
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Minimum 6 characters"
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

                            {/* Confirm Password Field */}
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
                                    Confirm Password
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
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
                                                    onClick={handleClickShowConfirmPassword}
                                                    edge="end"
                                                    sx={{ color: '#9e9e9e' }}
                                                >
                                                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            {/* Sign Up Button */}
                            <GradientButton
                                fullWidth
                                type="submit"
                                endIcon={<ArrowForward />}
                                sx={{ marginTop: '8px' }}
                            >
                                Sign Up
                            </GradientButton>
                        </Box>
                    </form>

                    {/* Sign In Link */}
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            marginTop: '24px',
                            color: '#757575',
                            fontSize: { xs: '13px', sm: '14px' },
                        }}
                    >
                        Already have an account?{' '}
                        <Link
                            onClick={() => navigate('/')}
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
                            Sign in
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
                    severity={snackbarMessage.includes('✅') ? 'success' : 'error'}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Signup;
