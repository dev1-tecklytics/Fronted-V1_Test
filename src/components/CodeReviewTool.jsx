import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    Card,
    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Security as SecurityIcon,
    PlayCircle as RunIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '24px',
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: 'linear-gradient(90deg, #9d4edd 0%, #f44336 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '2rem',
}));

const ConfigCard = styled(Card)(({ theme }) => ({
    padding: '32px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid #f0f0f0',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e0e0e0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9d4edd',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9d4edd',
    },
    borderRadius: '8px',
    background: '#ffffff',
}));

const RunButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(90deg, #9d4edd 0%, #f44336 100%)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    width: '100%',
    '&:hover': {
        background: 'linear-gradient(90deg, #8939c9 0%, #d32f2f 100%)',
    },
}));

const EmptyState = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: '80px 20px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
}));

const WarningBox = styled(Box)(({ theme }) => ({
    background: '#fff3e0',
    border: '1px solid #ff9800',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    color: '#e65100',
    fontSize: '14px',
}));

const CodeReviewTool = () => {
    const navigate = useNavigate();
    const [selectedWorkflow, setSelectedWorkflow] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('UiPath');

    const handleRunReview = () => {
        if (!selectedWorkflow) {
            alert('Please select a workflow');
            return;
        }
        console.log('Running code review:', { selectedWorkflow, selectedPlatform });
        alert('Code review feature coming soon!');
    };

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <Header>
                    <IconButton onClick={() => navigate('/workspace')} sx={{ color: '#212121' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Title>Code Review Tool</Title>
                        <Typography sx={{ color: '#757575', fontSize: '14px' }}>
                            Validate workflows against best practices and coding standards
                        </Typography>
                    </Box>
                </Header>

                <ConfigCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '16px' }}>
                        <SecurityIcon sx={{ color: '#9d4edd' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Configure Code Review
                        </Typography>
                    </Box>
                    <Typography sx={{ color: '#757575', fontSize: '14px', marginBottom: '24px' }}>
                        Select a workflow and platform to analyze code quality
                    </Typography>

                    <WarningBox>
                        Please upload and analyze workflows first from the dashboard.
                    </WarningBox>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, marginBottom: '24px' }}>
                        <FormControl fullWidth>
                            <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                Workflow
                            </Typography>
                            <StyledSelect
                                value={selectedWorkflow}
                                onChange={(e) => setSelectedWorkflow(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>No workflows available</em>
                                </MenuItem>
                            </StyledSelect>
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                Platform
                            </Typography>
                            <StyledSelect
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                            >
                                <MenuItem value="UiPath">UiPath</MenuItem>
                                <MenuItem value="Blue Prism">Blue Prism</MenuItem>
                            </StyledSelect>
                        </FormControl>
                    </Box>

                    <RunButton
                        startIcon={<RunIcon />}
                        onClick={handleRunReview}
                    >
                        Run Code Review
                    </RunButton>
                </ConfigCard>

                <EmptyState>
                    <SecurityIcon sx={{ fontSize: 80, color: '#e0e0e0', marginBottom: '16px' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '8px', color: '#212121' }}>
                        No Review Selected
                    </Typography>
                    <Typography sx={{ color: '#757575', maxWidth: '500px', margin: '0 auto' }}>
                        Select a workflow and platform above, then click "Run Code Review" to analyze your automation workflow
                        against industry best practices and coding standards.
                    </Typography>
                </EmptyState>
            </Container>
        </PageContainer>
    );
};

export default CodeReviewTool;
