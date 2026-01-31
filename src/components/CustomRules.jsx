import React, { useState, useEffect } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
    InputLabel,
    TextareaAutosize,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    FileUpload as ImportIcon,
    FileDownload as ExportIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Power as PowerIcon,
    PowerOff as PowerOffIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { CircularProgress, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { rulesAPI } from '../services/api';

const CustomRules = () => {
    const navigate = useNavigate();
    const [rules, setRules] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRules, setSelectedRules] = useState(new Set());
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [currentRule, setCurrentRule] = useState(null);
    const [importData, setImportData] = useState('');
    const [overwriteOnImport, setOverwriteOnImport] = useState(false);

    useEffect(() => {
        fetchRules();
    }, []);

    useEffect(() => {
        fetchRules();
    }, [platformFilter, categoryFilter, statusFilter]);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const params = {};
            if (platformFilter !== 'all') params.platform = platformFilter;
            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (statusFilter !== 'all') params.is_active = statusFilter === 'true';
            
            const data = await rulesAPI.getAll(params);
            console.log('API Response:', data);
            
            if (data) {
                const rulesArray = Array.isArray(data) ? data : (data.rules || []);
                console.log('Rules array:', rulesArray);
                setRules(rulesArray);
                setStats({
                    total: rulesArray.length,
                    active: rulesArray.filter(r => r.is_active).length,
                    inactive: rulesArray.filter(r => !r.is_active).length,
                    bySeverity: {
                        critical: rulesArray.filter(r => r.severity === 'critical').length,
                        high: rulesArray.filter(r => r.severity === 'high').length,
                        medium: rulesArray.filter(r => r.severity === 'medium').length,
                        low: rulesArray.filter(r => r.severity === 'low').length
                    }
                });
            } else {
                setRules([]);
                setStats(null);
            }
        } catch (error) {
            console.error('Failed to fetch rules:', error);
            setRules([]);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const ruleData = {
            ruleName: formData.get('ruleName'),
            category: formData.get('category'),
            severity: formData.get('severity'),
            platform: formData.get('platform'),
            description: formData.get('description'),
            recommendation: formData.get('recommendation'),
            checkType: formData.get('ruleType') || 'regex',
            checkPattern: formData.get('checkPattern') || '',
            isActive: true
        };

        try {
            await rulesAPI.create(ruleData);
            alert('Rule created successfully');
            setCreateDialogOpen(false);
            fetchRules();
        } catch (error) {
            alert('Failed to create rule: ' + error.message);
        }
    };

    const handleEditRule = async (e) => {
        e.preventDefault();
        const ruleId = currentRule?.rule_id || currentRule?.id;
        if (!ruleId) {
            alert('Cannot update rule: No ID found');
            return;
        }

        const formData = new FormData(e.currentTarget);
        
        const ruleData = {
            ruleName: formData.get('ruleName'),
            category: formData.get('category'),
            severity: formData.get('severity'),
            platform: formData.get('platform'),
            description: formData.get('description'),
            recommendation: formData.get('recommendation'),
            checkType: formData.get('ruleType') || 'regex',
            checkPattern: formData.get('checkPattern') || '',
            isActive: currentRule.isActive !== false
        };

        try {
            await rulesAPI.update(ruleId, ruleData);
            alert('Rule updated successfully');
            setEditDialogOpen(false);
            setCurrentRule(null);
            fetchRules();
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update rule: ' + error.message);
        }
    };

    const handleDeleteRule = async (rule) => {
        if (!window.confirm('Are you sure you want to delete this rule?')) return;

        const ruleId = rule.id || rule.rule_id || rule._id;
        console.log('Deleting rule with ID:', ruleId, 'Rule object:', rule);
        
        if (!ruleId) {
            alert('Cannot delete rule: No ID found');
            return;
        }

        try {
            await rulesAPI.delete(ruleId);
            alert('Rule deleted successfully');
            fetchRules();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete rule');
        }
    };

    const handleToggleActive = async (rule) => {
        const ruleId = rule.id || rule.rule_id || rule._id;
        console.log('Toggling rule with ID:', ruleId, 'Current active:', rule.is_active);
        
        if (!ruleId) {
            alert('Cannot toggle rule: No ID found');
            return;
        }

        try {
            await rulesAPI.update(ruleId, { isActive: !rule.is_active });
            alert(`Rule ${!rule.is_active ? 'activated' : 'deactivated'}`);
            fetchRules();
        } catch (error) {
            console.error('Toggle error:', error);
            alert('Failed to toggle rule status');
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedRules.size === 0) {
            alert('No rules selected');
            return;
        }

        try {
            const ruleIds = Array.from(selectedRules);
            await rulesAPI.bulkUpdate({ ruleIds, action });
            alert(`Bulk ${action} completed`);
            setSelectedRules(new Set());
            fetchRules();
        } catch (error) {
            alert(`Failed to ${action} rules`);
        }
    };

    const handleExport = async (format) => {
        try {
            const params = { file_format: format };
            
            const blob = await rulesAPI.export(params);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `custom-rules-${Date.now()}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            alert('Rules exported successfully');
        } catch (error) {
            alert('Error exporting rules');
        }
    };

    const handleImport = async () => {
        try {
            const rules = JSON.parse(importData);
            
            await rulesAPI.import({
                rules: Array.isArray(rules) ? rules : rules.rules || [],
                overwrite: overwriteOnImport
            });
            
            alert('Rules imported successfully!');
            setImportDialogOpen(false);
            setImportData('');
            fetchRules();
        } catch (error) {
            alert('Invalid JSON format or import failed');
        }
    };

    const filteredRules = rules.filter(rule => {
        const matchesSearch = rule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             rule.config?.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getSeverityBadge = (severity) => {
        const colors = {
            Critical: { color: '#d32f2f', bg: '#ffebee' },
            Major: { color: '#f57c00', bg: '#fff3e0' },
            Minor: { color: '#1976d2', bg: '#e3f2fd' },
            Info: { color: '#388e3c', bg: '#e8f5e9' }
        };
        const config = colors[severity] || colors.Info;
        return (
            <Chip 
                label={severity} 
                size="small" 
                sx={{ 
                    color: config.color, 
                    backgroundColor: config.bg,
                    fontWeight: 600
                }} 
            />
        );
    };

    const getPlatformBadge = (platform) => {
        const colors = {
            UiPath: '#9c27b0',
            BluePrism: '#2196f3',
            Both: '#757575'
        };
        return (
            <Chip 
                label={platform} 
                size="small" 
                sx={{ 
                    color: colors[platform] || colors.Both,
                    borderColor: colors[platform] || colors.Both
                }}
                variant="outlined"
            />
        );
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Skeleton height={60} sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} height={120} />
                    ))}
                </Box>
                <Skeleton height={400} />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/dashboard')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                >
                    Back to Dashboard
                </Button>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            Custom Enterprise Rules
                        </Typography>
                        <Typography color="textSecondary" sx={{ mt: 1 }}>
                            Manage custom code review rules for your organization
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" onClick={() => setImportDialogOpen(true)} startIcon={<ImportIcon />}>
                            Import
                        </Button>
                        <Button variant="outlined" onClick={() => handleExport('json')} startIcon={<ExportIcon />}>
                            Export JSON
                        </Button>
                        <Button variant="outlined" onClick={() => handleExport('csv')} startIcon={<ExportIcon />}>
                            Export CSV
                        </Button>
                        <Button variant="contained" onClick={() => setCreateDialogOpen(true)} startIcon={<AddIcon />}>
                            Create Rule
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Statistics Cards */}
            {stats && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="body2" color="textSecondary">Total Rules</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
                        <Typography variant="caption" color="textSecondary">
                            {stats.active} active, {stats.inactive} inactive
                        </Typography>
                    </Card>

                    <Card sx={{ p: 3 }}>
                        <Typography variant="body2" color="textSecondary">Critical Rules</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                            {stats.bySeverity?.Critical || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">High priority issues</Typography>
                    </Card>

                    <Card sx={{ p: 3 }}>
                        <Typography variant="body2" color="textSecondary">UiPath Rules</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0' }}>
                            {stats.byPlatform?.UiPath || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">Platform-specific</Typography>
                    </Card>

                    <Card sx={{ p: 3 }}>
                        <Typography variant="body2" color="textSecondary">BluePrism Rules</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3' }}>
                            {stats.byPlatform?.BluePrism || 0}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">Platform-specific</Typography>
                    </Card>
                </Box>
            )}

            {/* Filters and Search */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        placeholder="Search rules..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ flex: 1 }}
                    />
                    <FormControl sx={{ minWidth: 150 }}>
                        <Select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                            <MenuItem value="all">All Platforms</MenuItem>
                            <MenuItem value="UiPath">UiPath</MenuItem>
                            <MenuItem value="BluePrism">BluePrism</MenuItem>
                            <MenuItem value="Both">Both</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 150 }}>
                        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {selectedRules.size > 0 && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined" onClick={() => handleBulkAction('activate')} startIcon={<PowerIcon />}>
                            Activate ({selectedRules.size})
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => handleBulkAction('deactivate')} startIcon={<PowerOffIcon />}>
                            Deactivate ({selectedRules.size})
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleBulkAction('delete')} startIcon={<DeleteIcon />}>
                            Delete ({selectedRules.size})
                        </Button>
                    </Box>
                )}

                {filteredRules.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography color="textSecondary">No custom rules found</Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setCreateDialogOpen(true)} startIcon={<AddIcon />}>
                            Create Your First Rule
                        </Button>
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRules.size === filteredRules.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRules(new Set(filteredRules.map(r => r.id)));
                                                } else {
                                                    setSelectedRules(new Set());
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>Rule Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Severity</TableCell>
                                    <TableCell>Platform</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Check Type</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRules.map((rule, index) => (
                                    <TableRow key={rule.rule_id || rule.id || index}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedRules.has(rule.id)}
                                                onChange={(e) => {
                                                    const newSelected = new Set(selectedRules);
                                                    if (e.target.checked) {
                                                        newSelected.add(rule.id);
                                                    } else {
                                                        newSelected.delete(rule.id);
                                                    }
                                                    setSelectedRules(newSelected);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{rule.name}</TableCell>
                                        <TableCell>{rule.rule_type}</TableCell>
                                        <TableCell>{getSeverityBadge(rule.severity)}</TableCell>
                                        <TableCell>N/A</TableCell>
                                        <TableCell>
                                            {rule.is_active ? (
                                                <Chip label="Active" color="success" size="small" icon={<CheckCircleIcon />} />
                                            ) : (
                                                <Chip label="Inactive" color="default" size="small" icon={<PowerOffIcon />} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={rule.rule_type} variant="outlined" size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleToggleActive(rule)}
                                                    title={rule.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {rule.is_active ? <PowerOffIcon /> : <PowerIcon />}
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        console.log('Edit clicked for rule:', rule);
                                                        setCurrentRule(rule);
                                                        setEditDialogOpen(true);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteRule(rule)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>

            {/* Edit Rule Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Edit Custom Rule</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Modify the custom code review rule
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleEditRule}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                name="ruleName"
                                label="Rule Name"
                                required
                                fullWidth
                                defaultValue={currentRule?.name || ''}
                            />
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <FormControl required>
                                    <InputLabel>Rule Type</InputLabel>
                                    <Select name="ruleType" label="Rule Type" defaultValue={currentRule?.rule_type || 'regex'}>
                                        <MenuItem value="regex">Regex Pattern</MenuItem>
                                        <MenuItem value="activity_count">Activity Count</MenuItem>
                                        <MenuItem value="nesting_depth">Nesting Depth</MenuItem>
                                    </Select>
                                </FormControl>
                                
                                <FormControl required>
                                    <InputLabel>Severity</InputLabel>
                                    <Select name="severity" label="Severity" defaultValue={currentRule?.severity || 'low'}>
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                        <MenuItem value="critical">Critical</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <TextField
                                name="description"
                                label="Description"
                                required
                                multiline
                                rows={3}
                                placeholder="Describe what this rule checks for..."
                                fullWidth
                                defaultValue={currentRule?.description || ''}
                            />

                            <TextField
                                name="recommendation"
                                label="Recommendation"
                                required
                                multiline
                                rows={3}
                                placeholder="Provide guidance on how to fix violations..."
                                fullWidth
                                defaultValue={currentRule?.recommendation || ''}
                            />

                            <TextField
                                name="checkPattern"
                                label="Check Pattern"
                                placeholder="e.g., ^(?!ACME_) for regex or leave empty"
                                fullWidth
                                helperText="For regex type: pattern to match. For others: optional configuration"
                                defaultValue={currentRule?.config?.pattern || ''}
                            />
                        </Box>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Update Rule</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Create Custom Rule</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Define a new custom code review rule for your workflows
                    </Typography>
                </DialogTitle>
                <form onSubmit={handleCreateRule}>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                name="ruleName"
                                label="Rule Name"
                                required
                                fullWidth
                            />
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <FormControl required>
                                    <InputLabel>Category</InputLabel>
                                    <Select name="category" label="Category">
                                        <MenuItem value="Naming">Naming</MenuItem>
                                        <MenuItem value="ErrorHandling">Error Handling</MenuItem>
                                        <MenuItem value="Performance">Performance</MenuItem>
                                        <MenuItem value="Security">Security</MenuItem>
                                        <MenuItem value="Maintainability">Maintainability</MenuItem>
                                        <MenuItem value="Standards">Standards</MenuItem>
                                        <MenuItem value="Custom">Custom</MenuItem>
                                    </Select>
                                </FormControl>
                                
                                <FormControl required>
                                    <InputLabel>Severity</InputLabel>
                                    <Select name="severity" label="Severity">
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                        <MenuItem value="critical">Critical</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <FormControl required>
                                    <InputLabel>Platform</InputLabel>
                                    <Select name="platform" label="Platform">
                                        <MenuItem value="UiPath">UiPath</MenuItem>
                                        <MenuItem value="BluePrism">BluePrism</MenuItem>
                                        <MenuItem value="Both">Both</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl required>
                                    <InputLabel>Check Type</InputLabel>
                                    <Select name="checkType" label="Check Type">
                                        <MenuItem value="regex">Regex Pattern</MenuItem>
                                        <MenuItem value="activity_count">Activity Count</MenuItem>
                                        <MenuItem value="nesting_depth">Nesting Depth</MenuItem>
                                        <MenuItem value="custom">Custom Logic</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <TextField
                                name="description"
                                label="Description"
                                required
                                multiline
                                rows={3}
                                placeholder="Describe what this rule checks for..."
                                fullWidth
                            />

                            <TextField
                                name="recommendation"
                                label="Recommendation"
                                required
                                multiline
                                rows={3}
                                placeholder="Provide guidance on how to fix violations..."
                                fullWidth
                            />

                            <TextField
                                name="checkPattern"
                                label="Check Pattern"
                                placeholder="e.g., ^(?!ACME_) for regex or leave empty"
                                fullWidth
                                helperText="For regex type: pattern to match. For others: optional configuration"
                            />
                        </Box>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Create Rule</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Import Custom Rules</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Import rules from JSON format
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="JSON Data"
                        multiline
                        rows={12}
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder='Paste JSON data here...\n\nExample:\n[{\n  "ruleName": "...",\n  "category": "...",\n  ...\n}]'
                        fullWidth
                        sx={{ fontFamily: 'monospace', fontSize: '13px' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={overwriteOnImport}
                                onChange={(e) => setOverwriteOnImport(e.target.checked)}
                            />
                        }
                        label="Overwrite existing rules with same names"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleImport} variant="contained" startIcon={<ImportIcon />}>
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CustomRules;