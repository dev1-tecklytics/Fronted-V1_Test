import React, { useState, useEffect } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Download as DownloadIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    AutoAwesome as AIIcon,
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

const MetricCard = styled(Card)(({ theme }) => ({
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    textAlign: 'center',
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

const ExportButton = styled(Button)(({ theme, variant }) => ({
    padding: '12px 24px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    ...(variant === 'csv' ? {
        background: '#10b981',
        color: '#ffffff',
        '&:hover': {
            background: '#059669',
        },
    } : {
        background: '#3b82f6',
        color: '#ffffff',
        '&:hover': {
            background: '#2563eb',
        },
    }),
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
    const [sourcePlatform, setSourcePlatform] = useState('UiPath');
    const [targetPlatform, setTargetPlatform] = useState('Blue Prism');
    const [availableWorkflows, setAvailableWorkflows] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch projects and their history from backend
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const projects = await projectAPI.getAll();
                const allWorkflows = [];

                for (const project of projects) {
                    // Fetch analysis history for each project to get workflows
                    const history = await analysisAPI.getHistory(project.project_id);
                    if (history && history.length > 0) {
                        history.forEach(analysis => {
                            if (analysis.status === 'completed' || analysis.status === 'COMPLETED') {
                                allWorkflows.push({
                                    id: analysis.analysis_id,
                                    name: analysis.file_name,
                                    platform: project.platform,
                                    project: project.name,
                                    complexity: 'Medium', // Default or from results
                                    activities: 25, // Default or from results
                                    analysis_id: analysis.analysis_id
                                });
                            }
                        });
                    }
                }
                setAvailableWorkflows(allWorkflows);
            } catch (error) {
                console.error('Error loading analyzer data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);


    const handleAnalyze = async () => {
        if (!sourceWorkflow) {
            alert('Please select a workflow');
            return;
        }

        setAnalyzing(true);
        const selectedWorkflow = availableWorkflows.find(wf => wf.id === sourceWorkflow);

        console.log('🔍 Starting analysis for:', selectedWorkflow);

        // Skip backend call and use mock data directly for now
        // TODO: Implement backend endpoint /api/v1/analysis/compare-platforms
        try {
            console.log('⚠️ Backend endpoint not available, using mock data');
            generateMockAnalysis(selectedWorkflow);
        } catch (error) {
            console.error('❌ Mock data generation error:', error);
            alert('Failed to generate analysis. Please try again.');
        } finally {
            setAnalyzing(false);
        }

        /* Backend integration code (uncomment when endpoint is ready):
        try {
            const apiKey = localStorage.getItem('apiKey');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analysis/compare-platforms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey
                },
                body: JSON.stringify({
                    workflow_id: selectedWorkflow.id,
                    source_platform: sourcePlatform,
                    target_platform: targetPlatform,
                    workflow_data: selectedWorkflow.fullAnalysis
                })
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const data = await response.json();

            setAnalysisResults({
                workflow: selectedWorkflow,
                sourcePlatform,
                targetPlatform,
                metrics: data.metrics,
                activityMappings: data.activity_mappings,
                incompatibilities: data.incompatibilities,
                aiSuggestions: data.ai_suggestions
            });

        } catch (error) {
            console.error('Analysis error:', error);
            generateMockAnalysis(selectedWorkflow);
        } finally {
            setAnalyzing(false);
        }
        */
    };

    const generateMockAnalysis = (workflow) => {
        // Generate realistic mock data based on actual workflow
        const activityCount = workflow.activities || 15;
        const incompatibilityCount = Math.floor(activityCount * 0.3); // 30% incompatibilities
        const directMappings = activityCount - incompatibilityCount;
        const estimatedEffort = activityCount * 0.5; // 0.5h per activity average

        // Common UiPath activities and their Blue Prism equivalents
        const activityTemplates = [
            { source: 'Assign', category: 'Data Manipulation', target: 'Calculation', type: 'direct', effort: 0.2, notes: 'Direct variable assignment' },
            { source: 'If', category: 'Control Flow', target: 'Decision', type: 'direct', effort: 0.3, notes: 'Convert condition to Blue Prism expression' },
            { source: 'While', category: 'Control Flow', target: 'Loop (While)', type: 'direct', effort: 0.5, notes: 'Convert loop condition to Blue Prism expression' },
            { source: 'ForEach', category: 'Control Flow', target: 'Loop (Collection)', type: 'direct', effort: 0.5, notes: 'Iterate through collection items' },
            { source: 'Sequence', category: 'Control Flow', target: 'Page', type: 'direct', effort: 0.1, notes: 'Group activities in a page' },
            { source: 'Flowchart', category: 'Control Flow', target: 'Process', type: 'direct', effort: 0.2, notes: 'Convert to Blue Prism process flow' },
            { source: 'InvokeWorkflow', category: 'Workflow Invocation', target: 'Process Call', type: 'direct', effort: 0.4, notes: 'Call another process' },
            { source: 'TryCatch', category: 'Error Handling', target: 'Exception Block', type: 'direct', effort: 0.6, notes: 'Implement error handling' },
            { source: 'Throw', category: 'Error Handling', target: 'Exception Stage', type: 'direct', effort: 0.3, notes: 'Raise exception' },
            { source: 'Log Message', category: 'Logging', target: 'Write to Log', type: 'direct', effort: 0.2, notes: 'Log to Blue Prism logs' },
            { source: 'Read Range', category: 'Excel', target: 'MS Excel VBO - Get Worksheet', type: 'partial', effort: 1.0, notes: 'Use Excel VBO for data extraction' },
            { source: 'Write Range', category: 'Excel', target: 'MS Excel VBO - Write Collection', type: 'partial', effort: 1.0, notes: 'Use Excel VBO for data writing' },
            { source: 'Click', category: 'UI Automation', target: 'Navigate', type: 'partial', effort: 0.8, notes: 'Use Application Modeller for UI interaction' },
            { source: 'Type Into', category: 'UI Automation', target: 'Write', type: 'partial', effort: 0.7, notes: 'Use Application Modeller for text input' },
            { source: 'Get Text', category: 'UI Automation', target: 'Read', type: 'partial', effort: 0.7, notes: 'Use Application Modeller for text extraction' }
        ];

        // Generate activity mappings
        const activityMappings = [];
        for (let i = 0; i < directMappings; i++) {
            const template = activityTemplates[i % activityTemplates.length];
            const suffix = i >= activityTemplates.length ? ` ${Math.floor(i / activityTemplates.length) + 1}` : '';
            activityMappings.push({
                sourceActivity: template.source + suffix,
                category: template.category,
                targetEquivalent: template.target,
                mappingType: template.type,
                effort: template.effort,
                notes: template.notes
            });
        }

        // Generate incompatibilities
        const incompatibilities = [];
        const incompatibilityTemplates = [
            'VirtualizedContainerService.HintSize',
            'WorkflowViewStateService.ViewState',
            'sap:VirtualizedContainerService.HintSize',
            'sap:WorkflowViewStateService.ViewState',
            'Annotation',
            'TextExpression.ReferencesForImplementation',
            'VisualBasic.Settings',
            'x:ClassModifier',
            'InvokeCode',
            'Python Scope'
        ];

        for (let i = 0; i < incompatibilityCount; i++) {
            const template = incompatibilityTemplates[i % incompatibilityTemplates.length];
            const suffix = i >= incompatibilityTemplates.length ? ` ${Math.floor(i / incompatibilityTemplates.length) + 1}` : '';
            incompatibilities.push({
                activity: template + suffix,
                issue: 'No direct mapping available',
                description: 'Activity not found in mapping database. Manual analysis required.',
                status: 'unmapped',
                effort: 2
            });
        }

        console.log('📊 Generated analysis data:', {
            activityCount,
            incompatibilityCount,
            directMappings,
            estimatedEffort,
            mappingsGenerated: activityMappings.length,
            incompatibilitiesGenerated: incompatibilities.length
        });

        const results = {
            workflow,
            sourcePlatform,
            targetPlatform,
            metrics: {
                totalActivities: activityCount,
                incompatibilities: incompatibilityCount,
                estimatedEffort: Number(estimatedEffort.toFixed(1)),
                directMappings: directMappings
            },
            activityMappings,
            incompatibilities
        };

        console.log('✅ Setting analysis results:', results);
        setAnalysisResults(results);
    };

    const exportToCSV = () => {
        if (!analysisResults) return;

        const csvContent = [
            ['Source Activity', 'Category', 'Target Equivalent', 'Mapping Type', 'Effort (h)', 'Notes'],
            ...analysisResults.activityMappings.map(m => [
                m.sourceActivity,
                m.category,
                m.targetEquivalent,
                m.mappingType,
                m.effort,
                m.notes
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${analysisResults.workflow.name}_translation_map.csv`;
        a.click();
    };

    const exportToJSON = () => {
        if (!analysisResults) return;

        const jsonContent = JSON.stringify(analysisResults, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${analysisResults.workflow.name}_full_analysis.json`;
        a.click();
    };

    return (
        <PageContainer>
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography sx={{ color: '#757575', fontWeight: 500 }}>
                        Loading available workflows...
                    </Typography>
                </Box>
            ) : (
                <Container maxWidth="xl">

                    <Header>
                        <IconButton onClick={() => navigate('/dashboard')} sx={{ color: '#212121' }}>
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
                                    <MenuItem value="" disabled>
                                        <em>Select a workflow...</em>
                                    </MenuItem>
                                    {availableWorkflows.length === 0 ? (
                                        <MenuItem value="" disabled>
                                            <em>No workflows analyzed yet</em>
                                        </MenuItem>
                                    ) : (
                                        availableWorkflows.map((wf) => (
                                            <MenuItem key={wf.id} value={wf.id}>
                                                {wf.name} ({wf.project}) - {wf.activities} activities
                                            </MenuItem>
                                        ))
                                    )}
                                </StyledSelect>
                            </FormControl>

                            <FormControl fullWidth>
                                <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                    Source Platform
                                </Typography>
                                <StyledSelect
                                    value={sourcePlatform}
                                    onChange={(e) => setSourcePlatform(e.target.value)}
                                >
                                    <MenuItem value="UiPath">UiPath</MenuItem>
                                    <MenuItem value="Blue Prism">Blue Prism</MenuItem>
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
                                    <MenuItem value="UiPath">UiPath</MenuItem>
                                    <MenuItem value="Blue Prism">Blue Prism</MenuItem>
                                </StyledSelect>
                            </FormControl>
                        </Box>


                        <AnalyzeButton
                            endIcon={analyzing ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <ArrowForwardIcon />}
                            onClick={handleAnalyze}
                            disabled={analyzing || !sourceWorkflow}
                        >
                            {analyzing ? 'Analyzing...' : 'Analyze & Compare'}
                        </AnalyzeButton>
                    </ConfigCard>

                    {/* Analysis Results */}
                    {analysisResults && (
                        <>
                            {/* Metrics Cards */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
                                <MetricCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Total Activities</Typography>
                                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#2196f3' }}>
                                        {analysisResults.metrics.totalActivities}
                                    </Typography>
                                </MetricCard>

                                <MetricCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Incompatibilities</Typography>
                                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#f44336' }}>
                                        {analysisResults.metrics.incompatibilities}
                                    </Typography>
                                </MetricCard>

                                <MetricCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Estimated Effort</Typography>
                                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#9c27b0' }}>
                                        {analysisResults.metrics.estimatedEffort}h
                                    </Typography>
                                </MetricCard>

                                <MetricCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Direct Mappings</Typography>
                                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#4caf50' }}>
                                        {analysisResults.metrics.directMappings}
                                    </Typography>
                                </MetricCard>
                            </Box>

                            {/* Export Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <ExportButton
                                    variant="csv"
                                    startIcon={<DownloadIcon />}
                                    onClick={exportToCSV}
                                >
                                    Export Translation Map (CSV)
                                </ExportButton>
                                <ExportButton
                                    variant="json"
                                    startIcon={<DownloadIcon />}
                                    onClick={exportToJSON}
                                >
                                    Export Full Analysis (JSON)
                                </ExportButton>
                            </Box>

                            {/* Activity Translation Map */}
                            <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    Activity Translation Map
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#757575', mb: 3 }}>
                                    Side-by-side comparison of source and target activities
                                </Typography>

                                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ background: '#fafafa' }}>
                                                <TableCell sx={{ fontWeight: 600 }}>SOURCE ACTIVITY</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>CATEGORY</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>TARGET EQUIVALENT</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>MAPPING TYPE</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>EFFORT</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>ACTIONS</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {analysisResults.activityMappings.map((mapping, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{mapping.sourceActivity}</TableCell>
                                                    <TableCell>{mapping.category}</TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600 }}>{mapping.targetEquivalent}</Typography>
                                                            <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                                                {mapping.notes}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={<CheckIcon sx={{ fontSize: 16 }} />}
                                                            label={mapping.mappingType}
                                                            size="small"
                                                            sx={{
                                                                background: '#e8f5e9',
                                                                color: '#4caf50',
                                                                fontWeight: 600,
                                                                textTransform: 'lowercase'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{mapping.effort}h</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={<AIIcon sx={{ fontSize: 14 }} />}
                                                            label="AI Suggest"
                                                            size="small"
                                                            sx={{
                                                                background: '#f3e5f5',
                                                                color: '#9c27b0',
                                                                fontWeight: 600,
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>

                            {/* Incompatibilities & Complex Conversions */}
                            {analysisResults.incompatibilities.length > 0 && (
                                <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #ffebee', background: '#fffbfb', mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <WarningIcon sx={{ color: '#f44336' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f44336' }}>
                                            Incompatibilities & Complex Conversions
                                        </Typography>
                                    </Box>

                                    {analysisResults.incompatibilities.map((issue, index) => (
                                        <Alert
                                            key={index}
                                            severity="error"
                                            sx={{
                                                mb: 2,
                                                borderRadius: '8px',
                                                '& .MuiAlert-message': {
                                                    width: '100%'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {issue.activity} → {issue.issue}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                                        {issue.description}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Chip
                                                        label={issue.status}
                                                        size="small"
                                                        sx={{
                                                            background: '#fff',
                                                            color: '#9c27b0',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                    <Typography sx={{ fontSize: '14px', color: '#757575', minWidth: '40px', textAlign: 'right' }}>
                                                        {issue.effort}h
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Alert>
                                    ))}
                                </Card>
                            )}
                        </>
                    )}

                    {/* Empty State */}
                    {!analysisResults && !analyzing && (
                        <Box sx={{ textAlign: 'center', py: 8, background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <Typography sx={{ color: '#757575', mb: 2 }}>
                                No analysis results yet. Configure and run analysis to see detailed comparison.
                            </Typography>
                        </Box>
                    )}
                </Container>
            )}
        </PageContainer>

    );
};

export default WorkflowAnalyzer;
