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
    ArrowForward as ArrowForwardIcon,
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
    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
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
        borderColor: '#5e6ff2',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#5e6ff2',
    },
    borderRadius: '8px',
    background: '#ffffff',
}));

const AnalyzeButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 600,
    width: '100%',
    '&:hover': {
        background: 'linear-gradient(90deg, #4c5ed7 0%, #8939c9 100%)',
    },
}));

const EmptyState = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: '60px 20px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
}));

const DashboardButton = styled(Button)(({ theme }) => ({
    background: '#5e6ff2',
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: '#4c5ed7',
    },
}));

const WorkflowAnalyzer = () => {
    const navigate = useNavigate();
    const [sourceWorkflow, setSourceWorkflow] = useState('');
    const [sourcePlatform] = useState('UiPath');
    const [targetPlatform, setTargetPlatform] = useState('Blue Prism');

    const workflows = ['Select a workflow...', 'Invoice Processing', 'Customer Onboarding', 'Data Migration'];

    const handleAnalyze = () => {
        if (!sourceWorkflow || sourceWorkflow === 'Select a workflow...') {
            alert('Please select a workflow');
            return;
        }
        console.log('Analyzing workflow:', { sourceWorkflow, sourcePlatform, targetPlatform });
        alert('Analysis feature coming soon!');
    };

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <Header>
                    <IconButton onClick={() => navigate('/workspace')} sx={{ color: '#212121' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Title>Workflow Analyzer</Title>
                        <Typography sx={{ color: '#757575', fontSize: '14px' }}>
                            Reduce analysis time and ensure accuracy of translation
                        </Typography>
                    </Box>
                </Header>

                <ConfigCard>
                    <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '24px' }}>
                        Configure Analysis
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, marginBottom: '24px' }}>
                        <FormControl fullWidth>
                            <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                Source Workflow
                            </Typography>
                            <StyledSelect
                                value={sourceWorkflow}
                                onChange={(e) => setSourceWorkflow(e.target.value)}
                                displayEmpty
                            >
                                {workflows.map((wf) => (
                                    <MenuItem key={wf} value={wf}>
                                        {wf}
                                    </MenuItem>
                                ))}
                            </StyledSelect>
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                Source Platform
                            </Typography>
                            <StyledSelect value={sourcePlatform} disabled>
                                <MenuItem value="UiPath">UiPath</MenuItem>
                            </StyledSelect>
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                Target Platform
                            </Typography>
                            <StyledSelect
                                value={targetPlatform}
                                onChange={(e) => setTargetPlatform(e.target.value)}
                            >
                                <MenuItem value="Blue Prism">Blue Prism</MenuItem>
                                <MenuItem value="Automation Anywhere">Automation Anywhere</MenuItem>
                            </StyledSelect>
                        </FormControl>
                    </Box>

                    <AnalyzeButton
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleAnalyze}
                    >
                        Analyze & Compare
                    </AnalyzeButton>
                </ConfigCard>

                <EmptyState>
                    <Typography sx={{ color: '#757575', marginBottom: '16px' }}>
                        No workflows found. Please upload and analyze XAML files first.
                    </Typography>
                    <DashboardButton onClick={() => navigate('/workspace')}>
                        Go to Dashboard
                    </DashboardButton>
                </EmptyState>
            </Container>
        </PageContainer>
    );
};

export default WorkflowAnalyzer;
