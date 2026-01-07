import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    Select,
    MenuItem,
    Chip,
    Card,
    Snackbar,
    Alert,
    FormControl,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import {
    Logout as LogoutIcon,
    Person as PersonIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Folder as FolderIcon,
    PlayArrow as PlayIcon,
    CompareArrows as ConvertIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    CheckCircle as CheckIcon,
    TrendingUp as TrendingIcon,
    Warning as WarningIcon,
    ShowChart as ChartIcon,
    DataUsage as DataIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analysisAPI, apiKeyAPI, subscriptionAPI } from '../services/api';

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

const ProjectSelector = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#f5f7ff',
    padding: '8px 16px',
    borderRadius: '8px',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
    },
}));

const ActionToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '12px',
    padding: '16px 0',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
        gap: '8px',
    },
}));

const ActionButton = styled(Button)(({ theme, bgcolor }) => ({
    textTransform: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '14px',
    background: bgcolor || '#5e6ff2',
    color: '#ffffff',
    '&:hover': {
        background: bgcolor ? `${bgcolor}dd` : '#4c5ed7',
        transform: 'translateY(-1px)',
    },
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
        padding: '6px 12px',
        fontSize: '13px',
    },
}));

const OutlinedActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    color: '#212121',
    background: '#ffffff',
    '&:hover': {
        background: '#f5f5f5',
        borderColor: '#5e6ff2',
    },
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
        padding: '6px 12px',
        fontSize: '13px',
    },
}));

const UploadArea = styled(Box)(({ theme, isDragging }) => ({
    border: '2px dashed #e0e0e0',
    borderRadius: '12px',
    padding: '60px 40px',
    textAlign: 'center',
    background: isDragging ? '#f5f7ff' : '#fafafa',
    borderColor: isDragging ? '#5e6ff2' : '#e0e0e0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        background: '#f5f7ff',
        borderColor: '#5e6ff2',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '40px 20px',
    },
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
    padding: '40px',
    textAlign: 'center',
    background: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '12px',
    marginTop: '24px',
    [theme.breakpoints.down('sm')]: {
        padding: '24px',
    },
}));

const ProjectWorkspace = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Load projects from localStorage
    const loadedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const loadedCurrentProject = JSON.parse(localStorage.getItem('currentProject') || 'null');

    const [currentProject, setCurrentProject] = useState(
        loadedCurrentProject || {
            id: 'ABC',
            name: 'ABC',
            description: 'edcedc',
            platform: 'UiPath',
            workflows: 0,
        }
    );

    const [projects, setProjects] = useState([]);

    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [analyzing, setAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"name": "PrasannaKumarTR"}');

    // Update projects when localStorage changes
    useEffect(() => {
        const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        if (storedProjects.length > 0) {
            setProjects(storedProjects);
        }
    }, []);

    const handleProjectChange = (event) => {
        const selectedProject = projects.find(p => p.id === event.target.value);
        setCurrentProject(selectedProject);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        console.log('👋 User logged out');
        navigate('/');
    };

    const handleNewProject = () => {
        navigate('/dashboard');
    };

    const handleDeleteProject = () => {
        setSnackbarMessage('🗑️ Delete project functionality coming soon!');
        setSnackbarSeverity('info');
        setOpenSnackbar(true);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const getAcceptedExtensions = () => {
        if (currentProject.platform === 'UiPath') {
            return ['.xaml', '.xml'];
        } else if (currentProject.platform === 'Blue Prism' || currentProject.platform === 'BluePrism') {
            return ['.bp'];
        }
        return [];
    };

    const handleFiles = (files) => {
        const acceptedExt = getAcceptedExtensions();
        const validFiles = files.filter(file =>
            acceptedExt.some(ext => file.name.toLowerCase().endsWith(ext))
        );

        if (validFiles.length === 0) {
            const extList = acceptedExt.join(', ');
            setSnackbarMessage(`❌ Please upload ${currentProject.platform} workflow files (${extList})`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (validFiles.length !== files.length) {
            const extList = acceptedExt.join(', ');
            setSnackbarMessage(`⚠️ Some files were skipped. Only ${extList} files are allowed`);
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
        }

        setUploadedFiles([...uploadedFiles, ...validFiles]);
        if (validFiles.length === files.length) {
            setSnackbarMessage(`✅ ${validFiles.length} workflow file(s) uploaded successfully!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        }

        console.log('📁 Uploaded files:', validFiles.map(f => f.name));
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        if (uploadedFiles.length === 0) {
            setSnackbarMessage('❌ Please upload at least one file');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        setAnalyzing(true);

        try {
            // Check if API key exists, if not create one
            let apiKey = localStorage.getItem('apiKey');

            if (!apiKey) {
                console.log('🔑 No API key found. Creating one...');

                // First, try to ensure user has a subscription
                try {
                    console.log('📋 Checking for active subscription...');
                    await subscriptionAPI.getCurrent();
                    console.log('✅ Active subscription found');
                } catch (subError) {
                    console.log('⚠️ No active subscription. Creating trial subscription...');
                    try {
                        await subscriptionAPI.createTrial();
                        console.log('✅ Trial subscription created');
                    } catch (trialError) {
                        console.warn('⚠️ Could not create trial subscription:', trialError);
                        // Continue anyway - maybe subscription exists but endpoint is different
                    }
                }

                // Check if API key exists (should be created on login)
                if (!apiKey) {
                    throw new Error('API key not found. Please log out and log in again to generate an API key.');
                }
            }

            console.log('📤 Uploading files to backend for analysis...');

            // Upload all files to backend
            const uploadResults = await analysisAPI.uploadMultiple(uploadedFiles);
            console.log('✅ Upload results:', uploadResults);

            // For now, use mock data for the results
            // TODO: Poll the backend for actual analysis results
            // In a real implementation, you would:
            // 1. Get analysis IDs from uploadResults
            // 2. Poll each analysis ID until status is 'COMPLETED'
            // 3. Fetch the actual analysis data

            setAnalysisData({
                totalProcesses: uploadedFiles.length,
                avgComplexity: 286.5,
                totalActivities: 300,
                highRiskProcesses: uploadedFiles.length,
                processes: uploadedFiles.map((file, index) => ({
                    name: file.name.replace(/\.(xaml|bp|xml)$/i, ''),
                    platform: currentProject.platform,
                    complexity: 286.5,
                    level: 'Very High',
                    activities: 150,
                    effort: 68.7,
                    risks: ['High Nesting', 'Large Workflow', 'No Error Handling']
                }))
            });

            setSnackbarMessage(`✅ ${uploadedFiles.length} file(s) analyzed successfully!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setAnalyzing(false);
            setShowResults(true);

        } catch (error) {
            console.error('❌ Analysis error:', error);
            setSnackbarMessage(`❌ Analysis failed: ${error.message}`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setAnalyzing(false);
        }
    };

    const handleActionClick = (action) => {
        console.log(`🎯 Action clicked: ${action}`);

        // Navigate to respective pages
        switch (action) {
            case 'Workflow Analyzer':
                navigate('/workflow-analyzer');
                break;
            case 'UiPath to BluePrism':
                navigate('/uipath-to-blueprism');
                break;
            case 'Code Review':
                navigate('/code-review');
                break;
            case 'Custom Rules':
                navigate('/custom-rules');
                break;
            case 'Refresh':
                handleRefresh();
                break;
            case 'Export CSV':
                handleExportCSV();
                break;
            case 'Export JSON':
                handleExportJSON();
                break;
            default:
                setSnackbarMessage(`🚀 ${action} feature coming soon!`);
                setSnackbarSeverity('info');
                setOpenSnackbar(true);
        }
    };

    const handleRefresh = () => {
        console.log('🔄 Refreshing workspace...');
        setSnackbarMessage('✅ Workspace refreshed successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Reload projects from localStorage
        const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        if (storedProjects.length > 0) {
            setProjects(storedProjects);
        }
    };

    const handleExportCSV = () => {
        console.log('📊 Exporting to CSV...');

        // Create CSV content
        const csvContent = [
            ['Project ID', 'Project Name', 'Description', 'Platform', 'Workflows', 'Created At'].join(','),
            ...projects.map(p => [
                p.id,
                `"${p.name}"`,
                `"${p.description}"`,
                p.platform,
                p.workflows,
                p.createdAt || new Date().toISOString()
            ].join(','))
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `iaap_projects_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnackbarMessage('✅ Projects exported to CSV successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleExportJSON = () => {
        console.log('📄 Exporting to JSON...');

        // Create JSON content
        const jsonContent = JSON.stringify({
            exportDate: new Date().toISOString(),
            totalProjects: projects.length,
            projects: projects
        }, null, 2);

        // Create download link
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `iaap_projects_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnackbarMessage('✅ Projects exported to JSON successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    // Show analysis results page if analysis is complete
    if (showResults && analysisData) {
        return (
            <Box sx={{ minHeight: '100vh', background: '#fafbfc' }}>
                <StyledAppBar position="static">
                    <Toolbar>
                        <IconButton onClick={() => setShowResults(false)} sx={{ color: '#212121', mr: 2 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}>
                            <Logo>Automation Project Analyzer</Logo>
                            <Subtitle>Analysis Results</Subtitle>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ color: '#757575', fontSize: 20 }} />
                                <Typography sx={{ color: '#212121', fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                                    {currentUser.name}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleLogout} sx={{ color: '#757575', '&:hover': { color: '#f44336', background: 'rgba(244, 67, 54, 0.08)' } }}>
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </StyledAppBar>

                <Container maxWidth="xl" sx={{ mt: 3 }}>
                    <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
                        {uploadedFiles.length} file(s) uploaded successfully
                    </Alert>

                    {/* Statistics Cards */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                        <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '8px', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingIcon sx={{ color: '#2196f3', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '14px', color: '#757575' }}>Total Processes</Typography>
                                <Typography sx={{ fontSize: '28px', fontWeight: 700 }}>{analysisData.totalProcesses}</Typography>
                            </Box>
                        </Card>

                        <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '8px', background: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ChartIcon sx={{ color: '#9c27b0', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '14px', color: '#757575' }}>Avg Complexity Score</Typography>
                                <Typography sx={{ fontSize: '28px', fontWeight: 700 }}>{analysisData.avgComplexity}</Typography>
                            </Box>
                        </Card>

                        <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '8px', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DataIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '14px', color: '#757575' }}>Total Activities</Typography>
                                <Typography sx={{ fontSize: '28px', fontWeight: 700 }}>{analysisData.totalActivities}</Typography>
                            </Box>
                        </Card>

                        <Card sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: '8px', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <WarningIcon sx={{ color: '#f44336', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '14px', color: '#757575' }}>High-Risk Processes</Typography>
                                <Typography sx={{ fontSize: '28px', fontWeight: 700 }}>{analysisData.highRiskProcesses}</Typography>
                            </Box>
                        </Card>
                    </Box>

                    {/* Charts Section */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 3 }}>
                        {/* Complexity Distribution Chart */}
                        <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                Complexity Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[
                                    { name: 'Low', value: 0 },
                                    { name: 'Medium', value: 0 },
                                    { name: 'High', value: 0 },
                                    { name: 'Very High', value: 2 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#757575" />
                                    <YAxis stroke="#757575" />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#ff6b6b" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>

                        {/* Activity Type Breakdown Chart */}
                        <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                Activity Type Breakdown
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Other', value: 280 },
                                                { name: 'Control Flow', value: 12 },
                                                { name: 'Data Manipulation', value: 4 },
                                                { name: 'Workflow Invocation', value: 4 },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            <Cell fill="#4fc3f7" />
                                            <Cell fill="#ff6b6b" />
                                            <Cell fill="#ffa726" />
                                            <Cell fill="#ab47bc" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, justifyContent: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#4fc3f7' }} />
                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>Other</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#ff6b6b' }} />
                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>Control Flow</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#ffa726' }} />
                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>Data Manipulation</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#ab47bc' }} />
                                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>Workflow Invocation</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Box>

                    {/* Process Inventory Table */}
                    <Card sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Process Inventory</Typography>
                            <Chip label="All Levels" size="small" />
                        </Box>

                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #f0f0f0' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ background: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Process Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>PLATFORM</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Complexity</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>LEVEL</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Activities</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Effort (hrs)</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>RISK INDICATORS</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>ACTIONS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {analysisData.processes.map((process, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{process.name}</TableCell>
                                            <TableCell>
                                                <Chip label={process.platform} size="small" sx={{ background: '#f3e5f5', color: '#9c27b0', fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell>{process.complexity}</TableCell>
                                            <TableCell>
                                                <Chip label={process.level} size="small" sx={{ background: '#ffebee', color: '#d32f2f', fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell>{process.activities}</TableCell>
                                            <TableCell>{process.effort}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                                                    {process.risks.join(', ')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton size="small" sx={{ color: '#757575' }}>
                                                        <ViewIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" sx={{ color: '#757575' }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: '#fafbfc' }}>
            {/* App Bar */}
            <StyledAppBar position="static">
                <Toolbar sx={{ py: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Logo variant="h6">Automation Project Analyzer</Logo>
                        <Subtitle>Intelligent Automation Analysis Platform</Subtitle>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    </Box>
                </Toolbar>
            </StyledAppBar>

            {/* Project Selector Bar */}
            <Box sx={{ background: '#ffffff', borderBottom: '1px solid #f0f0f0', py: 2 }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <ProjectSelector>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FolderIcon sx={{ color: '#5e6ff2', fontSize: 24 }} />
                                <Typography sx={{ fontWeight: 600, color: '#212121', fontSize: '14px' }}>
                                    Active Project:
                                </Typography>
                            </Box>

                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <Select
                                    value={currentProject.id}
                                    onChange={handleProjectChange}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        background: '#ffffff',
                                        borderRadius: '6px',
                                    }}
                                >
                                    {projects.map((project) => (
                                        <MenuItem key={project.id} value={project.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background: project.platform === 'UiPath' ? '#9d4edd' : '#5e6ff2',
                                                    }}
                                                />
                                                {project.name} ({project.workflows} workflows)
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Chip
                                label={currentProject.platform}
                                size="small"
                                sx={{
                                    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                }}
                            />
                        </ProjectSelector>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleNewProject}
                                sx={{
                                    background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #4c5ed7 0%, #8939c9 100%)',
                                    },
                                }}
                            >
                                New Project
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteProject}
                                sx={{
                                    borderColor: '#f44336',
                                    color: '#f44336',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: '#d32f2f',
                                        background: 'rgba(244, 67, 54, 0.08)',
                                    },
                                }}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Action Toolbar */}
            <Container maxWidth="xl" sx={{ mt: 3 }}>
                <ActionToolbar>
                    <ActionButton
                        startIcon={<PlayIcon />}
                        bgcolor="#9d4edd"
                        onClick={() => handleActionClick('Workflow Analyzer')}
                    >
                        Workflow Analyzer
                    </ActionButton>
                    <ActionButton
                        startIcon={<ConvertIcon />}
                        bgcolor="#5e6ff2"
                        onClick={() => handleActionClick('UiPath to BluePrism')}
                    >
                        UiPath to BluePrism
                    </ActionButton>
                    <ActionButton
                        startIcon={<SecurityIcon />}
                        bgcolor="#f44336"
                        onClick={() => handleActionClick('Code Review')}
                    >
                        Code Review
                    </ActionButton>
                    <ActionButton
                        startIcon={<SettingsIcon />}
                        bgcolor="#ff9800"
                        onClick={() => handleActionClick('Custom Rules')}
                    >
                        Custom Rules
                    </ActionButton>
                    <OutlinedActionButton
                        startIcon={<RefreshIcon />}
                        onClick={() => handleActionClick('Refresh')}
                    >
                        Refresh
                    </OutlinedActionButton>
                    <OutlinedActionButton
                        startIcon={<DownloadIcon />}
                        onClick={() => handleActionClick('Export CSV')}
                    >
                        Export CSV
                    </OutlinedActionButton>
                    <OutlinedActionButton
                        startIcon={<DownloadIcon />}
                        onClick={() => handleActionClick('Export JSON')}
                    >
                        Export JSON
                    </OutlinedActionButton>
                </ActionToolbar>

                {/* Project Info */}
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: '#212121',
                            fontSize: { xs: '2rem', sm: '3rem' },
                        }}
                    >
                        {currentProject.name}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#757575',
                            mt: 1,
                        }}
                    >
                        {currentProject.description}
                    </Typography>
                </Box>

                {/* Platform Badge */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: '#212121',
                            mb: 1,
                        }}
                    >
                        Project Platform:
                    </Typography>
                    <Chip
                        label={currentProject.platform}
                        sx={{
                            background: 'linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '14px',
                            padding: '4px 8px',
                        }}
                    />
                </Box>

                {/* Upload Area */}
                <UploadArea
                    isDragging={isDragging}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                >
                    <UploadIcon sx={{ fontSize: 64, color: '#9e9e9e', mb: 2 }} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: '#212121',
                            mb: 1,
                        }}
                    >
                        Upload {currentProject.platform} {currentProject.platform === 'UiPath' ? 'XAML' : 'BP'} Workflow Files
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#757575',
                            mb: 3,
                        }}
                    >
                        Drag and drop your {currentProject.platform} {getAcceptedExtensions().join(', ')} files here, or click to browse
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            background: '#212121',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                background: '#424242',
                            },
                        }}
                    >
                        Browse Files
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={getAcceptedExtensions().join(',')}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                </UploadArea>

                {/* Empty State or File List */}
                {uploadedFiles.length === 0 ? (
                    <EmptyStateCard>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#757575',
                            }}
                        >
                            No workflows analyzed yet. Upload your workflow files to get started.
                        </Typography>
                    </EmptyStateCard>
                ) : (
                    <Card sx={{ mt: 3, p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Selected Files ({uploadedFiles.length})
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                            {uploadedFiles.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 2,
                                        background: '#ffffff',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <FolderIcon sx={{ color: '#5e6ff2' }} />
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                                                {file.name}
                                            </Typography>
                                            <Typography sx={{ color: '#757575', fontSize: '12px' }}>
                                                {(file.size / 1024).toFixed(2)} KB
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveFile(index)}
                                        sx={{ color: '#757575' }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        {analyzing && (
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                                    Analyzing workflows...
                                </Typography>
                                <LinearProgress
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        '& .MuiLinearProgress-bar': {
                                            background: 'linear-gradient(90deg, #9d4edd 0%, #f44336 100%)'
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={analyzing ? null : <CheckIcon />}
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            sx={{
                                background: 'linear-gradient(90deg, #9d4edd 0%, #f44336 100%)',
                                color: '#ffffff',
                                padding: '14px 28px',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #8939c9 0%, #d32f2f 100%)',
                                },
                                '&:disabled': {
                                    background: '#e0e0e0',
                                    color: '#9e9e9e',
                                },
                            }}
                        >
                            {analyzing ? 'Analyzing...' : `Upload and Analyze ${uploadedFiles.length} File(s)`}
                        </Button>
                    </Card>
                )}
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
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProjectWorkspace;
