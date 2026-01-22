import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ContentCopy as CopyIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Key as KeyIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { apiKeyAPI } from '../services/api';

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '24px',
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '2.5rem',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    marginBottom: '24px',
}));

const CreateButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
    },
}));

const KeyDisplay = styled(Box)(({ theme }) => ({
    background: '#f5f5f5',
    padding: '12px 16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '16px',
}));

const EmptyState = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: '80px 20px',
}));

const APIKeysManagement = () => {
    const navigate = useNavigate();
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createDialog, setCreateDialog] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [createdKey, setCreatedKey] = useState(null);
    const [showCreatedKey, setShowCreatedKey] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, keyId: null, keyName: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [visibleKeys, setVisibleKeys] = useState({});

    useEffect(() => {
        fetchAPIKeys();
    }, []);

    const fetchAPIKeys = async () => {
        try {
            const data = await apiKeyAPI.list();
            setApiKeys(data);
        } catch (error) {
            console.error('Failed to fetch API keys:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load API keys',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) {
            setSnackbar({
                open: true,
                message: 'Please enter a name for the API key',
                severity: 'warning',
            });
            return;
        }

        setCreating(true);
        try {
            const response = await apiKeyAPI.create(newKeyName);
            setCreatedKey(response.api_key);
            setShowCreatedKey(true);
            setNewKeyName('');
            setCreateDialog(false);
            fetchAPIKeys();

            // Also save to localStorage for immediate use
            localStorage.setItem('apiKey', response.api_key);

            setSnackbar({
                open: true,
                message: 'API key created successfully!',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to create API key',
                severity: 'error',
            });
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async () => {
        try {
            await apiKeyAPI.delete(deleteDialog.keyId);
            setSnackbar({
                open: true,
                message: 'API key deleted successfully',
                severity: 'success',
            });
            setDeleteDialog({ open: false, keyId: null, keyName: '' });
            fetchAPIKeys();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to delete API key',
                severity: 'error',
            });
        }
    };

    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        setSnackbar({
            open: true,
            message: 'API key copied to clipboard!',
            severity: 'success',
        });
    };

    const toggleKeyVisibility = (keyId) => {
        setVisibleKeys(prev => ({
            ...prev,
            [keyId]: !prev[keyId]
        }));
    };

    const maskKey = (key) => {
        if (!key) return '';
        const prefix = key.substring(0, 8);
        return `${prefix}${'*'.repeat(32)}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <PageContainer>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress size={60} />
                    </Box>
                </Container>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ mb: 2, textTransform: 'none', color: '#757575' }}
                >
                    Back to Dashboard
                </Button>
                <Header>
                    <Box>
                        <Title>API Keys</Title>
                        <Typography sx={{ color: '#757575', fontSize: '16px', marginTop: '8px' }}>
                            Manage your API keys for programmatic access
                        </Typography>
                    </Box>
                    <CreateButton
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialog(true)}
                    >
                        Create New Key
                    </CreateButton>
                </Header>

                <StyledCard>
                    {apiKeys.length === 0 ? (
                        <EmptyState>
                            <KeyIcon sx={{ fontSize: 80, color: '#e0e0e0', marginBottom: '16px' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '8px' }}>
                                No API Keys Yet
                            </Typography>
                            <Typography sx={{ color: '#757575', marginBottom: '24px' }}>
                                Create your first API key to start using the API
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setCreateDialog(true)}
                                sx={{
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
                                    },
                                }}
                            >
                                Create API Key
                            </Button>
                        </EmptyState>
                    ) : (
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ background: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Key</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {apiKeys.map((key) => (
                                        <TableRow key={key.api_key_id} hover>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 600 }}>
                                                    {key.name || 'Unnamed Key'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontFamily: 'monospace', fontSize: '13px' }}>
                                                        {visibleKeys[key.api_key_id]
                                                            ? key.key_prefix + '...'
                                                            : maskKey(key.key_prefix)}
                                                    </Typography>
                                                    <Tooltip title={visibleKeys[key.api_key_id] ? 'Hide' : 'Show'}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => toggleKeyVisibility(key.api_key_id)}
                                                        >
                                                            {visibleKeys[key.api_key_id] ? (
                                                                <VisibilityOffIcon fontSize="small" />
                                                            ) : (
                                                                <VisibilityIcon fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(key.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={key.is_active ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    sx={{
                                                        background: key.is_active ? '#e8f5e9' : '#f5f5f5',
                                                        color: key.is_active ? '#2e7d32' : '#616161',
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setDeleteDialog({
                                                                open: true,
                                                                keyId: key.api_key_id,
                                                                keyName: key.name,
                                                            })}
                                                            sx={{ color: '#f44336' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </StyledCard>

                {/* Create Key Dialog */}
                <Dialog open={createDialog} onClose={() => !creating && setCreateDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ marginBottom: '16px', color: '#757575' }}>
                            Give your API key a descriptive name to help you identify it later.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Key Name"
                            placeholder="e.g., Production Server"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            disabled={creating}
                            autoFocus
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateDialog(false)} disabled={creating}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateKey}
                            variant="contained"
                            disabled={creating}
                            sx={{
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
                                },
                            }}
                        >
                            {creating ? <CircularProgress size={24} /> : 'Create Key'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Show Created Key Dialog */}
                <Dialog open={showCreatedKey} onClose={() => setShowCreatedKey(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>API Key Created!</DialogTitle>
                    <DialogContent>
                        <Alert severity="warning" sx={{ marginBottom: '16px' }}>
                            <strong>Important:</strong> Copy this key now. You won't be able to see it again!
                        </Alert>
                        <Typography sx={{ marginBottom: '8px', fontWeight: 600 }}>
                            Your API Key:
                        </Typography>
                        <KeyDisplay>
                            <Typography sx={{ fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all' }}>
                                {createdKey}
                            </Typography>
                            <Tooltip title="Copy">
                                <IconButton onClick={() => handleCopyKey(createdKey)} size="small">
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </KeyDisplay>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowCreatedKey(false)} variant="contained">
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, keyId: null, keyName: '' })}>
                    <DialogTitle>Delete API Key?</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete the API key <strong>"{deleteDialog.keyName}"</strong>?
                            This action cannot be undone and any applications using this key will stop working.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog({ open: false, keyId: null, keyName: '' })}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteKey} color="error" variant="contained">
                            Delete Key
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </PageContainer>
    );
};

export default APIKeysManagement;
