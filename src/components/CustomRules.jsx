import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    FileUpload as ImportIcon,
    FileDownload as ExportIcon,
    Close as CloseIcon,
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
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '2rem',
    color: '#212121',
}));

const StatsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
}));

const StatCard = styled(Card)(({ theme }) => ({
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
}));

const SearchBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
}));

const EmptyState = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: '80px 20px',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        '&:hover fieldset': {
            borderColor: '#ff9800',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ff9800',
        },
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: '8px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ff9800',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ff9800',
    },
}));

const CreateButton = styled(Button)(({ theme }) => ({
    background: '#212121',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: '#424242',
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '8px 16px',
}));

const CustomRules = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [platformFilter, setPlatformFilter] = useState('All Platforms');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);

    // Form state for Create Rule
    const [ruleForm, setRuleForm] = useState({
        ruleName: '',
        category: '',
        severity: '',
        platform: '',
        checkType: '',
        description: '',
        recommendation: '',
        checkPattern: '',
    });

    // Import JSON state
    const [jsonData, setJsonData] = useState('');
    const [overwriteRules, setOverwriteRules] = useState(false);

    const stats = {
        total: 0,
        totalActive: 0,
        totalInactive: 0,
        critical: 0,
        criticalIssues: 'High priority issues',
        uipath: 0,
        uipathSpecific: 'Platform-specific',
        blueprism: 0,
        blueprismSpecific: 'Platform-specific',
    };

    const handleCreateRule = () => {
        console.log('Creating rule:', ruleForm);
        // Validate form
        if (!ruleForm.ruleName || !ruleForm.category || !ruleForm.severity) {
            alert('Please fill in all required fields');
            return;
        }
        alert('Rule created successfully!');
        setCreateDialogOpen(false);
        // Reset form
        setRuleForm({
            ruleName: '',
            category: '',
            severity: '',
            platform: '',
            checkType: '',
            description: '',
            recommendation: '',
            checkPattern: '',
        });
    };

    const handleImportJSON = () => {
        if (!jsonData.trim()) {
            alert('Please paste JSON data');
            return;
        }
        try {
            JSON.parse(jsonData);
            console.log('Importing rules:', jsonData);
            console.log('Overwrite existing:', overwriteRules);
            alert('Rules imported successfully!');
            setImportDialogOpen(false);
            setJsonData('');
            setOverwriteRules(false);
        } catch (error) {
            alert('Invalid JSON format. Please check your data.');
        }
    };

    const handleExportJSON = () => {
        console.log('📄 Exporting rules to JSON...');

        // Create sample rules data (in real app, this would come from state/API)
        const rulesData = {
            exportDate: new Date().toISOString(),
            totalRules: stats.total,
            rules: [
                // Sample rule structure
                {
                    ruleName: "Example Rule",
                    category: "Naming",
                    severity: "High",
                    platform: "UiPath",
                    checkType: "Regex",
                    description: "Sample rule description",
                    recommendation: "Sample recommendation",
                    checkPattern: "^[A-Z]"
                }
            ]
        };

        const jsonContent = JSON.stringify(rulesData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `custom_rules_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('✅ Rules exported to JSON successfully!');
    };

    const handleExportCSV = () => {
        console.log('📊 Exporting rules to CSV...');

        // Create CSV content
        const csvContent = [
            ['Rule Name', 'Category', 'Severity', 'Platform', 'Check Type', 'Description'].join(','),
            // Sample data (in real app, this would come from state/API)
            ['Example Rule', 'Naming', 'High', 'UiPath', 'Regex', '"Sample description"'].join(',')
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `custom_rules_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('✅ Rules exported to CSV successfully!');
    };

    return (
        <PageContainer>
            <Container maxWidth="xl">
                {/* Header */}
                <Header>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate('/workspace')} sx={{ color: '#212121' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Title>Custom Enterprise Rules</Title>
                            <Typography sx={{ color: '#757575', fontSize: '14px' }}>
                                Manage custom code review rules for your organization
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <ActionButton
                            variant="outlined"
                            startIcon={<ImportIcon />}
                            onClick={() => setImportDialogOpen(true)}
                        >
                            Import
                        </ActionButton>
                        <ActionButton
                            variant="outlined"
                            startIcon={<ExportIcon />}
                            onClick={handleExportJSON}
                        >
                            Export JSON
                        </ActionButton>
                        <ActionButton
                            variant="outlined"
                            startIcon={<ExportIcon />}
                            onClick={handleExportCSV}
                        >
                            Export CSV
                        </ActionButton>
                        <CreateButton
                            startIcon={<AddIcon />}
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            Create Rule
                        </CreateButton>
                    </Box>
                </Header>

                {/* Statistics Cards */}
                <StatsGrid>
                    <StatCard>
                        <Typography sx={{ fontSize: '14px', color: '#757575', marginBottom: '8px' }}>
                            Total Rules
                        </Typography>
                        <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#212121' }}>
                            {stats.total}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>
                            {stats.totalActive} active, {stats.totalInactive} inactive
                        </Typography>
                    </StatCard>

                    <StatCard>
                        <Typography sx={{ fontSize: '14px', color: '#757575', marginBottom: '8px' }}>
                            Critical Rules
                        </Typography>
                        <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#f44336' }}>
                            {stats.critical}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>
                            {stats.criticalIssues}
                        </Typography>
                    </StatCard>

                    <StatCard>
                        <Typography sx={{ fontSize: '14px', color: '#757575', marginBottom: '8px' }}>
                            UiPath Rules
                        </Typography>
                        <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#9d4edd' }}>
                            {stats.uipath}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>
                            {stats.uipathSpecific}
                        </Typography>
                    </StatCard>

                    <StatCard>
                        <Typography sx={{ fontSize: '14px', color: '#757575', marginBottom: '8px' }}>
                            BluePrism Rules
                        </Typography>
                        <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#5e6ff2' }}>
                            {stats.blueprism}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>
                            {stats.blueprismSpecific}
                        </Typography>
                    </StatCard>
                </StatsGrid>

                {/* Search and Filters */}
                <SearchBar>
                    <StyledTextField
                        placeholder="Search rules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1, minWidth: '250px' }}
                        size="small"
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <StyledSelect
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                        >
                            <MenuItem value="All Platforms">All Platforms</MenuItem>
                            <MenuItem value="UiPath">UiPath</MenuItem>
                            <MenuItem value="BluePrism">BluePrism</MenuItem>
                        </StyledSelect>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <StyledSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="All Status">All Status</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </StyledSelect>
                    </FormControl>
                </SearchBar>

                {/* Empty State */}
                <EmptyState>
                    <Typography sx={{ color: '#757575', marginBottom: '16px', fontSize: '16px' }}>
                        No custom rules found
                    </Typography>
                    <CreateButton
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        Create Your First Rule
                    </CreateButton>
                </EmptyState>

                {/* Create Rule Dialog */}
                <StyledDialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Create Custom Rule
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                Define a new custom code review rule for your workflows
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setCreateDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Rule Name */}
                            <Box>
                                <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                    Rule Name *
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    placeholder="Enter rule name"
                                    value={ruleForm.ruleName}
                                    onChange={(e) => setRuleForm({ ...ruleForm, ruleName: e.target.value })}
                                />
                            </Box>

                            {/* Category and Severity */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                        Category *
                                    </Typography>
                                    <FormControl fullWidth>
                                        <StyledSelect
                                            value={ruleForm.category}
                                            onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value })}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Select category</MenuItem>
                                            <MenuItem value="Naming">Naming</MenuItem>
                                            <MenuItem value="Security">Security</MenuItem>
                                            <MenuItem value="Performance">Performance</MenuItem>
                                            <MenuItem value="Best Practices">Best Practices</MenuItem>
                                        </StyledSelect>
                                    </FormControl>
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                        Severity *
                                    </Typography>
                                    <FormControl fullWidth>
                                        <StyledSelect
                                            value={ruleForm.severity}
                                            onChange={(e) => setRuleForm({ ...ruleForm, severity: e.target.value })}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Select severity</MenuItem>
                                            <MenuItem value="Critical">Critical</MenuItem>
                                            <MenuItem value="High">High</MenuItem>
                                            <MenuItem value="Medium">Medium</MenuItem>
                                            <MenuItem value="Low">Low</MenuItem>
                                        </StyledSelect>
                                    </FormControl>
                                </Box>
                            </Box>

                            {/* Platform and Check Type */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                        Platform *
                                    </Typography>
                                    <FormControl fullWidth>
                                        <StyledSelect
                                            value={ruleForm.platform}
                                            onChange={(e) => setRuleForm({ ...ruleForm, platform: e.target.value })}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Select platform</MenuItem>
                                            <MenuItem value="UiPath">UiPath</MenuItem>
                                            <MenuItem value="BluePrism">BluePrism</MenuItem>
                                            <MenuItem value="Both">Both</MenuItem>
                                        </StyledSelect>
                                    </FormControl>
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                        Check Type *
                                    </Typography>
                                    <FormControl fullWidth>
                                        <StyledSelect
                                            value={ruleForm.checkType}
                                            onChange={(e) => setRuleForm({ ...ruleForm, checkType: e.target.value })}
                                            displayEmpty
                                        >
                                            <MenuItem value="">Select check type</MenuItem>
                                            <MenuItem value="Regex">Regex</MenuItem>
                                            <MenuItem value="XPath">XPath</MenuItem>
                                            <MenuItem value="Custom">Custom</MenuItem>
                                        </StyledSelect>
                                    </FormControl>
                                </Box>
                            </Box>

                            {/* Description */}
                            <Box>
                                <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                    Description *
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Describe what this rule checks for..."
                                    value={ruleForm.description}
                                    onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                                />
                            </Box>

                            {/* Recommendation */}
                            <Box>
                                <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                    Recommendation *
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Provide guidance on how to fix violations..."
                                    value={ruleForm.recommendation}
                                    onChange={(e) => setRuleForm({ ...ruleForm, recommendation: e.target.value })}
                                />
                            </Box>

                            {/* Check Pattern */}
                            <Box>
                                <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                    Check Pattern
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    placeholder="e.g., ^(?!ACME_) for regex or leave empty"
                                    value={ruleForm.checkPattern}
                                    onChange={(e) => setRuleForm({ ...ruleForm, checkPattern: e.target.value })}
                                />
                                <Typography sx={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>
                                    For regex type: pattern to match. For others: optional configuration
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ padding: '16px 24px' }}>
                        <Button onClick={() => setCreateDialogOpen(false)} sx={{ textTransform: 'none' }}>
                            Cancel
                        </Button>
                        <CreateButton onClick={handleCreateRule}>
                            Create Rule
                        </CreateButton>
                    </DialogActions>
                </StyledDialog>

                {/* Import JSON Dialog */}
                <StyledDialog
                    open={importDialogOpen}
                    onClose={() => setImportDialogOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Import Custom Rules
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: '#757575' }}>
                                Import rules from JSON format
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setImportDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Box>
                            <Typography sx={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                JSON Data
                            </Typography>
                            <StyledTextField
                                fullWidth
                                multiline
                                rows={12}
                                placeholder='Paste JSON data here...\n\nExample:\n[{\n  "ruleName": "...",\n  "category": "...",\n  ...\n}]'
                                value={jsonData}
                                onChange={(e) => setJsonData(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontFamily: 'monospace',
                                        fontSize: '13px',
                                    },
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={overwriteRules}
                                        onChange={(e) => setOverwriteRules(e.target.checked)}
                                    />
                                }
                                label="Overwrite existing rules with same names"
                                sx={{ marginTop: '12px' }}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ padding: '16px 24px' }}>
                        <Button onClick={() => setImportDialogOpen(false)} sx={{ textTransform: 'none' }}>
                            Cancel
                        </Button>
                        <CreateButton startIcon={<ImportIcon />} onClick={handleImportJSON}>
                            Import
                        </CreateButton>
                    </DialogActions>
                </StyledDialog>
            </Container>
        </PageContainer>
    );
};

export default CustomRules;
