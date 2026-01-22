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
    Chip,
    LinearProgress,
    Tabs,
    Tab,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Security as SecurityIcon,
    PlayCircle as RunIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    AutoAwesome as AIIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
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
    background: 'linear-gradient(90deg, #9d4edd 0%, #f44336 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '2rem',
    marginBottom: '8px',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    color: '#757575',
    fontSize: '14px',
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

const MetricCard = styled(Card)(({ theme }) => ({
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    textAlign: 'center',
}));

const GradeCard = styled(Card)(({ theme }) => ({
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    textAlign: 'center',
    background: '#ffebee',
}));

const CategoryItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const IssueCard = styled(Card)(({ theme }) => ({
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    marginBottom: '12px',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
}));

const CodeReviewTool = () => {
    const navigate = useNavigate();
    const [selectedWorkflow, setSelectedWorkflow] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('UiPath');
    const [workflows, setWorkflows] = useState([]);
    const [reviewResults, setReviewResults] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [aiInsightsAvailable, setAiInsightsAvailable] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkflows();
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
                        // Only include completed analyses
                        if (analysis.status === 'completed' || analysis.status === 'COMPLETED') {
                            allWorkflows.push({
                                id: analysis.analysis_id,
                                name: analysis.file_name,
                                project: project.name,
                                activities: 45, // Mock default
                                fullAnalysis: analysis.result || {}
                            });
                        }
                    });
                }
            }

            setWorkflows(allWorkflows);
            if (allWorkflows.length > 0) {
                setSelectedWorkflow(allWorkflows[0].id);
            }
        } catch (error) {
            console.error('Failed to load workflows for code review:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleRunReview = () => {
        if (!selectedWorkflow) {
            alert('Please select a workflow');
            return;
        }

        const workflow = workflows.find(wf => wf.id === selectedWorkflow);

        // Generate mock code review results
        const results = generateCodeReviewResults(workflow);
        setReviewResults(results);
        setAiInsightsAvailable(false);
    };

    const generateCodeReviewResults = (workflow) => {
        const activityCount = workflow.activities || 50;
        const criticalIssues = Math.floor(activityCount * 0.04); // 4%
        const majorIssues = Math.floor(activityCount * 0.44); // 44%
        const minorIssues = activityCount - criticalIssues - majorIssues;
        const totalIssues = criticalIssues + majorIssues + minorIssues;

        const qualityScore = 29.2; // F grade

        return {
            workflowName: workflow.name,
            reviewedAt: new Date().toISOString(),
            qualityGrade: 'F',
            qualityScore: qualityScore,
            critical: criticalIssues,
            major: majorIssues,
            minor: minorIssues,
            info: Math.floor(activityCount * 0.52),
            totalIssues: totalIssues,
            categories: [
                { name: 'Naming', icon: '🏷️', issues: 0, score: 0 },
                { name: 'Error Handling', icon: '🛡️', issues: 0, score: 0 },
                { name: 'Performance', icon: '⚡', issues: activityCount, score: 100 },
                { name: 'Security', icon: '🔒', issues: 7, score: 0 },
                { name: 'Maintainability', icon: '🔧', issues: 15, score: 13 },
                { name: 'Standards', icon: '📋', issues: 0, score: 0 },
            ],
            ruleBasedIssues: [
                {
                    id: 'UP-REL-001',
                    title: 'All workflows wrapped in Try-Catch blocks with pro...',
                    category: 'Reliability',
                    severity: 'High',
                    effort: 'Low',
                    issue: 'Missing exception handling',
                    description: 'All workflows wrapped in Try-Catch blocks with proper exception handling',
                    recommendation: 'Add Try-Catch blocks for error handling',
                    impact: 'High: Workflow may crash'
                },
                {
                    id: 'UP-REL-002',
                    title: 'Business exceptions separated from system exceptio...',
                    category: 'Reliability',
                    severity: 'High',
                    effort: 'Low',
                    issue: 'Missing exception handling',
                    description: 'Business exceptions should be separated from system exceptions',
                    recommendation: 'Implement separate exception handling for business and system errors',
                    impact: 'Medium: Difficult to debug'
                }
            ]
        };
    };

    const handleRunAIAnalysis = () => {
        setAiInsightsAvailable(true);
        setActiveTab(1);
    };

    const handleExportCSV = () => {
        if (!reviewResults) return;

        const csvContent = [
            ['Issue ID', 'Title', 'Category', 'Severity', 'Effort', 'Description'],
            ...reviewResults.ruleBasedIssues.map(issue => [
                issue.id,
                issue.title,
                issue.category,
                issue.severity,
                issue.effort,
                issue.description
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reviewResults.workflowName}_code_review.csv`;
        a.click();
    };

    return (
        <PageContainer>
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography sx={{ color: '#757575', fontWeight: 500 }}>
                        Loading workflows for review...
                    </Typography>
                </Box>
            ) : (
                <Container maxWidth="lg">

                    <Header>
                        <BackButton
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/dashboard')}
                        >
                            Dashboard
                        </BackButton>
                        <Title>Code Review Tool</Title>
                        <Subtitle>Validate workflows against best practices and coding standards</Subtitle>
                    </Header>

                    <ConfigCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '16px' }}>
                            <SecurityIcon sx={{ color: '#212121' }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Configure Code Review
                            </Typography>
                        </Box>
                        <Typography sx={{ color: '#757575', fontSize: '14px', marginBottom: '24px' }}>
                            Select a workflow and platform to analyze code quality
                        </Typography>

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
                                    {workflows.length === 0 ? (
                                        <MenuItem value="">
                                            <em>No workflows available</em>
                                        </MenuItem>
                                    ) : (
                                        workflows.map(wf => (
                                            <MenuItem key={wf.id} value={wf.id}>
                                                {wf.name}
                                            </MenuItem>
                                        ))
                                    )}
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
                            disabled={!selectedWorkflow}
                        >
                            Run Code Review
                        </RunButton>
                    </ConfigCard>

                    {reviewResults && (
                        <>
                            {/* Results Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {reviewResults.workflowName}
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                        Reviewed on {new Date(reviewResults.reviewedAt).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        startIcon={<RefreshIcon />}
                                        onClick={handleRunReview}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Fresh Analysis
                                    </Button>
                                    <Button
                                        startIcon={<RefreshIcon />}
                                        onClick={handleRunReview}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Re-run Review
                                    </Button>
                                </Box>
                            </Box>

                            {/* Metrics Cards */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                                <GradeCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Quality Grade</Typography>
                                    <Typography sx={{ fontSize: '64px', fontWeight: 700, color: '#c62828', lineHeight: 1 }}>
                                        {reviewResults.qualityGrade}
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mt: 1 }}>
                                        Score: {reviewResults.qualityScore}/100
                                    </Typography>
                                </GradeCard>

                                <MetricCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Critical</Typography>
                                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#c62828' }}>
                                        {reviewResults.critical}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                        Must fix immediately
                                    </Typography>
                                </MetricCard>

                                <MetricCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Major</Typography>
                                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#ff9800' }}>
                                        {reviewResults.major}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                        Should be addressed
                                    </Typography>
                                </MetricCard>

                                <MetricCard>
                                    <Typography sx={{ fontSize: '14px', color: '#757575', mb: 1 }}>Total Issues</Typography>
                                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#212121' }}>
                                        {reviewResults.totalIssues}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                        {reviewResults.minor} minor, {reviewResults.info} info
                                    </Typography>
                                </MetricCard>
                            </Box>

                            {/* Category Breakdown */}
                            <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0', mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            Category Breakdown
                                        </Typography>
                                        <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                            Scores by quality category (0-100)
                                        </Typography>
                                    </Box>
                                    <Button
                                        startIcon={<DownloadIcon />}
                                        onClick={handleExportCSV}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Export CSV
                                    </Button>
                                </Box>

                                {reviewResults.categories.map((category, index) => (
                                    <CategoryItem key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                            <Typography sx={{ fontSize: '20px' }}>{category.icon}</Typography>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Typography sx={{ fontWeight: 600 }}>{category.name}</Typography>
                                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                                        {category.issues} issues
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={category.score}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#f0f0f0',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: category.score === 100 ? '#212121' : '#e0e0e0',
                                                            borderRadius: 4,
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <Typography sx={{ fontWeight: 700, minWidth: '60px', textAlign: 'right' }}>
                                            {category.score}%
                                        </Typography>
                                    </CategoryItem>
                                ))}
                            </Card>

                            {/* Code Review Analysis */}
                            <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            Code Review Analysis
                                        </Typography>
                                        <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                            Rule-based findings and AI-powered insights
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<AIIcon />}
                                        onClick={handleRunAIAnalysis}
                                        sx={{
                                            background: 'linear-gradient(90deg, #9d4edd 0%, #f44336 100%)',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Run AI Analysis
                                    </Button>
                                </Box>

                                <Tabs
                                    value={activeTab}
                                    onChange={(e, newValue) => setActiveTab(newValue)}
                                    sx={{
                                        mb: 3,
                                        '& .MuiTab-root': {
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                        },
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: '#212121',
                                        },
                                    }}
                                >
                                    <Tab label={`Rule-Based (${reviewResults.ruleBasedIssues.length})`} />
                                    <Tab label="AI Insights" />
                                </Tabs>

                                {activeTab === 0 && (
                                    <Box>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                            <Select defaultValue="all" size="small" sx={{ minWidth: 150 }}>
                                                <MenuItem value="all">All Severities</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="low">Low</MenuItem>
                                            </Select>
                                            <Select defaultValue="all" size="small" sx={{ minWidth: 150 }}>
                                                <MenuItem value="all">All Categories</MenuItem>
                                                <MenuItem value="reliability">Reliability</MenuItem>
                                                <MenuItem value="security">Security</MenuItem>
                                            </Select>
                                            <Box sx={{ flex: 1 }} />
                                            <Button
                                                startIcon={<DownloadIcon />}
                                                onClick={handleExportCSV}
                                                sx={{ textTransform: 'none', fontWeight: 600 }}
                                            >
                                                Export CSV
                                            </Button>
                                        </Box>

                                        {reviewResults.ruleBasedIssues.map((issue, index) => (
                                            <IssueCard key={index}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '16px', flex: 1 }}>
                                                        {issue.title}
                                                    </Typography>
                                                    <Chip
                                                        label={issue.severity}
                                                        size="small"
                                                        sx={{
                                                            background: issue.severity === 'High' ? '#ffebee' : '#fff3e0',
                                                            color: issue.severity === 'High' ? '#c62828' : '#ef6c00',
                                                            fontWeight: 600,
                                                            ml: 2
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                    <Chip label={issue.id} size="small" variant="outlined" />
                                                    <Chip label={issue.category} size="small" variant="outlined" />
                                                    <Chip label={`Effort: ${issue.effort}`} size="small" variant="outlined" />
                                                </Box>

                                                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
                                                    Issue:
                                                </Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#757575', mb: 2 }}>
                                                    {issue.issue}
                                                </Typography>

                                                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
                                                    Description:
                                                </Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#757575', mb: 2 }}>
                                                    {issue.description}
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, p: 2, background: '#f5f5f5', borderRadius: '8px', mb: 2 }}>
                                                    <Typography sx={{ fontSize: '14px', color: '#5e6ff2', fontWeight: 600 }}>
                                                        🔧 Recommendation:
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '14px', color: '#212121' }}>
                                                        {issue.recommendation}
                                                    </Typography>
                                                </Box>

                                                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
                                                    Impact:
                                                </Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#c62828' }}>
                                                    {issue.impact}
                                                </Typography>
                                            </IssueCard>
                                        ))}
                                    </Box>
                                )}

                                {activeTab === 1 && (
                                    <Box sx={{ textAlign: 'center', py: 6, background: '#f9f9ff', borderRadius: '8px' }}>
                                        {!aiInsightsAvailable ? (
                                            <>
                                                <AIIcon sx={{ fontSize: 64, color: '#9d4edd', mb: 2 }} />
                                                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                                                    AI Analysis Not Available Yet
                                                </Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#757575', maxWidth: '600px', mx: 'auto' }}>
                                                    Click the "Run AI Analysis" button to get intelligent, context-aware insights beyond rule-based checks.
                                                    The AI will analyze your workflow architecture, identify patterns, and provide optimization recommendations.
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <CheckIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
                                                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                                                    AI Analysis Complete!
                                                </Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#757575', maxWidth: '600px', mx: 'auto', mb: 3 }}>
                                                    Advanced AI insights are now available. The analysis includes workflow architecture review,
                                                    pattern detection, and intelligent optimization suggestions.
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    View AI Insights
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                )}
                            </Card>
                        </>
                    )}
                </Container>
            )}
        </PageContainer>

    );
};

export default CodeReviewTool;
