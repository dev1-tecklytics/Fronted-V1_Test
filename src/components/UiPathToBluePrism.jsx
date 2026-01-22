import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    Checkbox,
    IconButton,
    Chip,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    CompareArrows as ConvertIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { projectAPI, analysisAPI } from '../services/api';


const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '24px',
}));

const Header = styled(Box)(({ theme }) => ({
    marginBottom: '32px',
}));

const BackButton = styled(Button)(({ theme }) => ({
    color: '#212121',
    textTransform: 'none',
    fontWeight: 600,
    marginBottom: '16px',
    '&:hover': {
        background: '#f5f5f5',
    },
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '2rem',
    color: '#212121',
    marginBottom: '8px',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    color: '#757575',
    fontSize: '14px',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginBottom: '24px',
    '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '14px',
        minHeight: '48px',
        color: '#757575',
        '&.Mui-selected': {
            color: '#212121',
        },
    },
    '& .MuiTabs-indicator': {
        backgroundColor: '#212121',
    },
}));

const WorkflowCard = styled(Card)(({ theme }) => ({
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    marginBottom: '24px',
}));

const WorkflowItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: '#fafafa',
        borderColor: '#e0e0e0',
    },
}));

const ConvertButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: 'linear-gradient(90deg, #4c5ed7 0%, #8939c9 100%)',
    },
    '&:disabled': {
        background: '#e0e0e0',
        color: '#9e9e9e',
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    color: '#757575',
    '&:hover': {
        background: '#f5f5f5',
    },
}));

const HistoryItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    marginBottom: '12px',
    background: '#ffffff',
}));

const UiPathToBluePrism = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedWorkflows, setSelectedWorkflows] = useState([]);
    const [workflows, setWorkflows] = useState([]);
    const [conversionHistory, setConversionHistory] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadWorkflows();
        loadConversionHistory();
    }, []);

    const loadWorkflows = async () => {
        setLoading(true);
        try {

            const projects = await projectAPI.getAll();
            const allWorkflows = [];

            for (const project of projects) {
                const history = await analysisAPI.getHistory(project.project_id);
                if (history && history.length > 0) {
                    history.forEach(analysis => {
                        if (analysis.status === 'completed' || analysis.status === 'COMPLETED') {
                            const result = analysis.result || {};
                            allWorkflows.push({
                                id: analysis.analysis_id,
                                name: analysis.file_name,
                                project: project.name,
                                activities: 45, // Mock value
                                complexity: 'Medium',
                                complexityLevel: 'Medium',
                                fullAnalysis: result
                            });
                        }
                    });
                }
            }

            setWorkflows(allWorkflows);
        } catch (error) {
            console.error('Failed to load workflows for conversion:', error);
        } finally {
            setLoading(false);
        }
    };


    const loadConversionHistory = () => {
        const history = JSON.parse(localStorage.getItem('conversion_history') || '[]');
        setConversionHistory(history);
    };

    const handleSelectWorkflow = (workflowId) => {
        setSelectedWorkflows(prev => {
            if (prev.includes(workflowId)) {
                return prev.filter(id => id !== workflowId);
            } else {
                return [...prev, workflowId];
            }
        });
    };

    const handleSelectAll = () => {
        setSelectedWorkflows(workflows.map(wf => wf.id));
    };

    const handleDeselectAll = () => {
        setSelectedWorkflows([]);
    };

    const handleConvert = async () => {
        if (selectedWorkflows.length === 0) {
            alert('Please select at least one workflow to convert');
            return;
        }

        const selectedWorkflowData = workflows.filter(wf => selectedWorkflows.includes(wf.id));

        const conversions = selectedWorkflowData.map(wf => ({
            id: `conv_${Date.now()}_${wf.id}`,
            workflowName: wf.name,
            date: new Date().toISOString(),
            compatibilityScore: 0,
            activitiesConverted: 0,
            totalActivities: wf.activities,
            status: 'partial',
            downloadUrl: '#'
        }));

        const updatedHistory = [...conversions, ...conversionHistory];
        localStorage.setItem('conversion_history', JSON.stringify(updatedHistory));
        setConversionHistory(updatedHistory);

        setActiveTab(1);
        setSelectedWorkflows([]);

        alert(`Successfully initiated conversion for ${selectedWorkflows.length} workflow(s)!`);
    };

    const handleDownload = (conversion) => {
        const blueprismXml = `<?xml version="1.0" encoding="utf-8"?>
<process name="${conversion.workflowName}" version="1.0" bpversion="6.10.4" narrative="">
  <!-- Converted from UiPath on ${new Date(conversion.date).toLocaleString()} -->
  <!-- Total Activities: ${conversion.totalActivities} -->
  <!-- Compatibility: ${conversion.compatibilityScore}% -->
  <view>
    <page name="Main Page" subsheetid="1">
      <!-- BluePrism process stages will be generated here -->
    </page>
  </view>
</process>`;

        const blob = new Blob([blueprismXml], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${conversion.workflowName}_BluePrism.xml`;
        a.click();
    };

    const handleRefresh = () => {
        loadWorkflows();
        loadConversionHistory();
    };

    return (
        <PageContainer>
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography sx={{ color: '#757575', fontWeight: 500 }}>
                        Loading workflows from projects...
                    </Typography>
                </Box>
            ) : (
                <Container maxWidth="lg">

                    <Header>
                        <BackButton
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/dashboard')}
                        >
                            Back to Dashboard
                        </BackButton>
                        <Title>UiPath to BluePrism Converter</Title>
                        <Subtitle>Convert your UiPath workflows to BluePrism format</Subtitle>
                    </Header>

                    <StyledTabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                        <Tab icon={<ConvertIcon />} iconPosition="start" label="Convert Workflows" />
                        <Tab icon={<RefreshIcon />} iconPosition="start" label="Conversion History" />
                    </StyledTabs>

                    {activeTab === 0 && (
                        <WorkflowCard>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        Select Workflows to Convert
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                        {selectedWorkflows.length} of {workflows.length} workflow(s) selected
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <ActionButton onClick={handleSelectAll}>
                                        Select All
                                    </ActionButton>
                                    <ActionButton onClick={handleDeselectAll}>
                                        Deselect All
                                    </ActionButton>
                                    <ConvertButton
                                        startIcon={<ConvertIcon />}
                                        onClick={handleConvert}
                                        disabled={selectedWorkflows.length === 0}
                                    >
                                        Convert to BluePrism
                                    </ConvertButton>
                                </Box>
                            </Box>

                            {workflows.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Typography sx={{ color: '#757575', mb: 2 }}>
                                        No workflows found. Please analyze some workflows first.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/workspace')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Go to Workspace
                                    </Button>
                                </Box>
                            ) : (
                                workflows.map(workflow => (
                                    <WorkflowItem key={workflow.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Checkbox
                                                checked={selectedWorkflows.includes(workflow.id)}
                                                onChange={() => handleSelectWorkflow(workflow.id)}
                                            />
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {workflow.name}
                                                </Typography>
                                                <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                                    {workflow.project}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                                {workflow.activities} activities
                                            </Typography>
                                            <Chip
                                                label={workflow.complexityLevel}
                                                size="small"
                                                sx={{
                                                    background: workflow.complexityLevel === 'Very High' ? '#ffebee' :
                                                        workflow.complexityLevel === 'High' ? '#fff3e0' :
                                                            workflow.complexityLevel === 'Medium' ? '#e3f2fd' : '#e8f5e9',
                                                    color: workflow.complexityLevel === 'Very High' ? '#c62828' :
                                                        workflow.complexityLevel === 'High' ? '#ef6c00' :
                                                            workflow.complexityLevel === 'Medium' ? '#1565c0' : '#2e7d32',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </WorkflowItem>
                                ))
                            )}
                        </WorkflowCard>
                    )}

                    {activeTab === 1 && (
                        <WorkflowCard>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        Conversion History
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                        View your past conversions
                                    </Typography>
                                </Box>
                                <IconButton onClick={handleRefresh}>
                                    <RefreshIcon />
                                </IconButton>
                            </Box>

                            {conversionHistory.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Typography sx={{ color: '#757575' }}>
                                        No conversion history yet. Convert some workflows to see them here.
                                    </Typography>
                                </Box>
                            ) : (
                                conversionHistory.map(conversion => (
                                    <HistoryItem key={conversion.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '8px',
                                                    background: '#fff3e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '20px'
                                                }}
                                            >
                                                ⚠️
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {conversion.workflowName}
                                                </Typography>
                                                <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                                    {new Date(conversion.date).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#f44336', mb: 0.5 }}>
                                                    {conversion.compatibilityScore}% compatible
                                                </Typography>
                                                <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                                    {conversion.activitiesConverted}/{conversion.totalActivities} activities
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={conversion.status}
                                                size="small"
                                                sx={{
                                                    background: '#fff',
                                                    border: '1px solid #e0e0e0',
                                                    fontWeight: 600
                                                }}
                                            />
                                            <IconButton onClick={() => handleDownload(conversion)}>
                                                <DownloadIcon />
                                            </IconButton>
                                        </Box>
                                    </HistoryItem>
                                ))
                            )}
                        </WorkflowCard>
                    )}
                </Container>
            )}
        </PageContainer>

    );
};

export default UiPathToBluePrism;
