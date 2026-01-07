import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    IconButton,
    Tabs,
    Tab,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    CompareArrows as ConvertIcon,
    History as HistoryIcon,
    Description as FileIcon,
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
    fontSize: '2rem',
    color: '#212121',
}));

const TabsContainer = styled(Box)(({ theme }) => ({
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '24px',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    color: '#757575',
    '&.Mui-selected': {
        color: '#212121',
    },
}));

const EmptyStateCard = styled(Card)(({ theme }) => ({
    padding: '60px 20px',
    textAlign: 'center',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
}));

const InfoBox = styled(Box)(({ theme }) => ({
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '24px',
}));

const UiPathToBluePrism = () => {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <Header>
                    <IconButton onClick={() => navigate('/workspace')} sx={{ color: '#212121' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Title>UiPath to BluePrism Converter</Title>
                        <Typography sx={{ color: '#757575', fontSize: '14px' }}>
                            Convert your UiPath workflows to BluePrism format
                        </Typography>
                    </Box>
                </Header>

                <TabsContainer>
                    <Tabs
                        value={currentTab}
                        onChange={(e, newValue) => setCurrentTab(newValue)}
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#212121',
                            },
                        }}
                    >
                        <StyledTab icon={<ConvertIcon />} iconPosition="start" label="Convert Workflows" />
                        <StyledTab icon={<HistoryIcon />} iconPosition="start" label="Conversion History" />
                    </Tabs>
                </TabsContainer>

                {currentTab === 0 && (
                    <>
                        <InfoBox>
                            <FileIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                            <Typography sx={{ fontSize: '14px', color: '#856404' }}>
                                No UiPath workflows found. Please upload UiPath workflows first.
                            </Typography>
                        </InfoBox>

                        <EmptyStateCard>
                            <Typography sx={{ color: '#757575', fontSize: '16px' }}>
                                Upload UiPath workflows from the dashboard to start converting them to BluePrism format.
                            </Typography>
                        </EmptyStateCard>
                    </>
                )}

                {currentTab === 1 && (
                    <EmptyStateCard>
                        <HistoryIcon sx={{ fontSize: 64, color: '#e0e0e0', marginBottom: '16px' }} />
                        <Typography sx={{ color: '#757575', fontSize: '16px', marginBottom: '8px', fontWeight: 600 }}>
                            No Conversion History
                        </Typography>
                        <Typography sx={{ color: '#9e9e9e', fontSize: '14px' }}>
                            Your conversion history will appear here once you start converting workflows.
                        </Typography>
                    </EmptyStateCard>
                )}
            </Container>
        </PageContainer>
    );
};

export default UiPathToBluePrism;
