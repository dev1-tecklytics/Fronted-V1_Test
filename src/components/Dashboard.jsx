import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Avatar,
    IconButton,
    AppBar,
    Toolbar,
    ToggleButton,
    ToggleButtonGroup,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Folder as FolderIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Add as AddIcon,
    TrendingFlat as ArrowIcon,
    Security as SecurityIcon,
    CompareArrows as ConvertIcon,
    ContentCopy as CopyIcon,
    Key as KeyIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    borderBottom: '1px solid #f0f0f0',
}));

const Logo = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '1.5rem',
    flexGrow: 1,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    color: '#757575',
    fontSize: '0.875rem',
    marginTop: '-4px',
}));

const UserSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    [theme.breakpoints.down('sm')]: {
        gap: '8px',
    },
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginTop: '60px',
    marginBottom: '40px',
    [theme.breakpoints.down('sm')]: {
        marginTop: '40px',
        marginBottom: '30px',
    },
}));

const FolderIconWrapper = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(94, 111, 242, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)',
    marginBottom: '24px',
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
        '0%, 100%': {
            transform: 'translateY(0)',
        },
        '50%': {
            transform: 'translateY(-10px)',
        },
    },
    [theme.breakpoints.down('sm')]: {
        width: '60px',
        height: '60px',
    },
}));

const ProjectFormCard = styled(Card)(({ theme }) => ({
    maxWidth: '640px',
    margin: '0 auto',
    padding: '32px',
    borderRadius: '16px',
    border: '2px dashed #e0e0e0',
    boxShadow: 'none',
    background: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        padding: '20px',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        '& fieldset': {
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: '#5e6ff2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#5e6ff2',
            borderWidth: '2px',
        },
    },
}));

const PlatformButton = styled(ToggleButton)(({ theme }) => ({
    flex: 1,
    padding: '16px',
    borderRadius: '8px !important',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    border: '2px solid #e0e0e0 !important',
    '&.Mui-selected': {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important',
        color: '#ffffff !important',
        border: '2px solid #5e6ff2 !important',
    },
    '&:hover': {
        background: '#f5f5f5',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '12px',
        fontSize: '14px',
    },
}));

const CreateButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
    borderRadius: '8px',
    padding: '14px 28px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(94, 111, 242, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(90deg, #4c5ed7 0%, #8939c9 100%)',
        boxShadow: '0 6px 16px rgba(94, 111, 242, 0.4)',
        transform: 'translateY(-2px)',
    },
    '&:disabled': {
        background: '#e0e0e0',
        color: '#9e9e9e',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '12px 24px',
        fontSize: '14px',
    },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        borderColor: '#5e6ff2',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '16px',
    },
}));

const FeatureIconWrapper = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    marginBottom: '16px',
}));

const Dashboard = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        platform: 'uipath',
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Get user from localStorage or use default
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"name": "PrasannaKumarTR"}');
    const apiKey = localStorage.getItem('apiKey');
    const apiKeyName = localStorage.getItem('apiKeyName') || 'Auto-generated on Login';

    const handleCopyApiKey = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setSnackbarMessage('✅ API Key copied to clipboard!');
            setOpenSnackbar(true);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlatformChange = (event, newPlatform) => {
        if (newPlatform !== null) {
            setFormData({
                ...formData,
                platform: newPlatform,
            });
        }
    };

    const handleCreateProject = () => {
        if (!formData.projectName.trim()) {
            setSnackbarMessage('❌ Please enter a project name');
            setOpenSnackbar(true);
            return;
        }

        // Create project object
        const newProject = {
            id: formData.projectName.substring(0, 3).toUpperCase(),
            name: formData.projectName,
            description: formData.description || 'No description',
            platform: formData.platform === 'uipath' ? 'UiPath' : 'Blue Prism',
            workflows: 0,
            createdAt: new Date().toISOString(),
        };

        // Store project in localStorage
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        localStorage.setItem('projects', JSON.stringify([...existingProjects, newProject]));
        localStorage.setItem('currentProject', JSON.stringify(newProject));

        console.log('🚀 Creating project:', newProject);
        setSnackbarMessage('✅ Project created successfully! Redirecting to workspace...');
        setOpenSnackbar(true);

        // Navigate to workspace after 1.5 seconds
        setTimeout(() => {
            navigate('/workspace');
        }, 1500);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        console.log('👋 User logged out');
        navigate('/');
    };

    const handleFeatureClick = (feature) => {
        console.log(`🎯 Clicked feature: ${feature}`);
        setSnackbarMessage(`🚀 ${feature} feature coming soon!`);
        setOpenSnackbar(true);
    };

    return (
        <Box sx={{ minHeight: '100vh', background: '#fafbfc' }}>
            {/* App Bar */}
            <StyledAppBar position="static">
                <Toolbar sx={{ py: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Logo variant="h6">Automation Project Analyzer</Logo>
                        <Subtitle>Intelligent Automation Analysis Platform</Subtitle>
                    </Box>

                    <UserSection>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: '#757575', fontSize: 20 }} />
                            <Typography
                                sx={{
                                    color: '#212121',
                                    fontWeight: 500,
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                {currentUser.name}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={handleLogout}
                            sx={{
                                color: '#757575',
                                '&:hover': {
                                    color: '#f44336',
                                    background: 'rgba(244, 67, 54, 0.08)',
                                },
                            }}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </UserSection>
                </Toolbar>
            </StyledAppBar>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ pb: 8 }}>
                {/* Welcome Section */}
                <WelcomeSection>
                    <FolderIconWrapper>
                        <FolderIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: '#5e6ff2' }} />
                    </FolderIconWrapper>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '12px',
                            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                        }}
                    >
                        Welcome to IAAP Platform
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#757575',
                            maxWidth: '600px',
                            margin: '0 auto',
                            fontSize: { xs: '14px', sm: '16px' },
                            px: { xs: 2, sm: 0 },
                        }}
                    >
                        Get started by creating your first project. Projects help you organize your RPA
                        workflows and migration analysis in one place.
                    </Typography>
                </WelcomeSection>

                {/* API Key Section */}
                {apiKey && (
                    <Card sx={{ maxWidth: '640px', margin: '0 auto 32px', padding: '24px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '16px' }}>
                            <KeyIcon sx={{ color: '#5e6ff2', fontSize: 32 }} />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Your API Key
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                    {apiKeyName}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{
                            background: '#f5f5f5',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            marginBottom: '12px'
                        }}>
                            <Typography sx={{
                                fontFamily: 'monospace',
                                fontSize: '13px',
                                wordBreak: 'break-all',
                                flexGrow: 1,
                                color: '#212121'
                            }}>
                                {apiKey.substring(0, 20)}...{apiKey.substring(apiKey.length - 10)}
                            </Typography>
                            <IconButton onClick={handleCopyApiKey} size="small" sx={{ color: '#5e6ff2' }}>
                                <CopyIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography sx={{ fontSize: '12px', color: '#757575', textAlign: 'center' }}>
                            ⚠️ Keep this key secure. It's used for API authentication.
                        </Typography>
                    </Card>
                )}

                {/* Project Form */}
                <ProjectFormCard>
                    <CardContent sx={{ padding: '0 !important' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                textAlign: 'center',
                                marginBottom: '8px',
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            }}
                        >
                            Create Your First Project
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#757575',
                                textAlign: 'center',
                                marginBottom: '32px',
                                fontSize: { xs: '13px', sm: '14px' },
                            }}
                        >
                            Choose your RPA platform and give your project a meaningful name
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Project Name */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#212121',
                                    }}
                                >
                                    Project Name *
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="projectName"
                                    placeholder="e.g., Invoice Processing Migration"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                />
                            </Box>

                            {/* Description */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#212121',
                                    }}
                                >
                                    Description (Optional)
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="description"
                                    multiline
                                    rows={4}
                                    placeholder="Describe the purpose of this project..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Box>

                            {/* RPA Platform */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        marginBottom: '12px',
                                        color: '#212121',
                                    }}
                                >
                                    RPA Platform *
                                </Typography>
                                <ToggleButtonGroup
                                    value={formData.platform}
                                    exclusive
                                    onChange={handlePlatformChange}
                                    fullWidth
                                    sx={{ gap: 2 }}
                                >
                                    <PlatformButton value="uipath">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: formData.platform === 'uipath' ? '#9d4edd' : '#757575',
                                                }}
                                            />
                                            UiPath
                                        </Box>
                                    </PlatformButton>
                                    <PlatformButton value="blueprism">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: formData.platform === 'blueprism' ? '#5e6ff2' : '#757575',
                                                }}
                                            />
                                            Blue Prism
                                        </Box>
                                    </PlatformButton>
                                </ToggleButtonGroup>
                            </Box>

                            {/* Create Button */}
                            <CreateButton
                                fullWidth
                                onClick={handleCreateProject}
                                startIcon={<AddIcon />}
                            >
                                Create Project & Get Started
                            </CreateButton>
                        </Box>
                    </CardContent>
                </ProjectFormCard>

                {/* Feature Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                        gap: 3,
                        marginTop: '60px',
                    }}
                >
                    {/* Workflow Analysis */}
                    <FeatureCard onClick={() => handleFeatureClick('Workflow Analysis')}>
                        <FeatureIconWrapper sx={{ background: 'rgba(94, 111, 242, 0.1)' }}>
                            <ArrowIcon sx={{ color: '#5e6ff2', fontSize: 24 }} />
                        </FeatureIconWrapper>
                        <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '8px' }}>
                            Workflow Analysis
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575', lineHeight: 1.6 }}>
                            Upload and analyze UiPath or Blue Prism workflows to assess complexity and migration effort
                        </Typography>
                    </FeatureCard>

                    {/* Code Review */}
                    <FeatureCard onClick={() => handleFeatureClick('Code Review')}>
                        <FeatureIconWrapper sx={{ background: 'rgba(244, 67, 54, 0.1)' }}>
                            <SecurityIcon sx={{ color: '#f44336', fontSize: 24 }} />
                        </FeatureIconWrapper>
                        <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '8px' }}>
                            Code Review
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575', lineHeight: 1.6 }}>
                            Automated quality checks with 50+ rules for naming, security, performance, and best practices
                        </Typography>
                    </FeatureCard>

                    {/* UiPath to BluePrism Converter */}
                    <FeatureCard onClick={() => handleFeatureClick('UiPath to BluePrism Converter')}>
                        <FeatureIconWrapper sx={{ background: 'rgba(33, 150, 243, 0.1)' }}>
                            <ConvertIcon sx={{ color: '#2196f3', fontSize: 24 }} />
                        </FeatureIconWrapper>
                        <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '8px' }}>
                            UiPath to BluePrism Converter
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575', lineHeight: 1.6 }}>
                            Convert UiPath workflows to BluePrism format with detailed compatibility analysis and warnings
                        </Typography>
                    </FeatureCard>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarMessage.includes('✅') ? 'success' : snackbarMessage.includes('❌') ? 'error' : 'info'}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard;
