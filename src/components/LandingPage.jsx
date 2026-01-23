import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Check as CheckIcon,
  Star as StarIcon,
  Rocket as RocketIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Code as CodeIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  padding: "80px 24px",
  position: "relative",
  overflow: "hidden",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  color: "#ffffff",
  fontSize: "4rem",
  marginBottom: "24px",
  lineHeight: 1.2,
  [theme.breakpoints.down("md")]: {
    fontSize: "3rem",
  },
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.95)",
  fontSize: "1.5rem",
  marginBottom: "40px",
  maxWidth: "700px",
  lineHeight: 1.6,
}));

const CTAButton = styled(Button)(({ theme }) => ({
  padding: "16px 48px",
  borderRadius: "50px",
  fontSize: "18px",
  fontWeight: 700,
  textTransform: "none",
  background: "#ffffff",
  color: "#667eea",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "#f5f5f5",
    transform: "translateY(-2px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
  },
  transition: "all 0.3s ease",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "3rem",
  textAlign: "center",
  marginBottom: "16px",
  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  padding: "40px",
  borderRadius: "20px",
  height: "100%",
  border: "1px solid #f0f0f0",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
}));

const PricingCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "featured",
})(({ theme, featured }) => ({
  position: "relative",
  borderRadius: "24px",
  padding: "40px 32px",
  height: "100%",
  transition: "all 0.3s ease",
  border: featured ? "3px solid #ffd700" : "1px solid #e0e0e0",
  transform: featured ? "scale(1.05)" : "scale(1)",
  boxShadow: featured
    ? "0 20px 60px rgba(0, 0, 0, 0.3)"
    : "0 10px 30px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: featured ? "scale(1.08)" : "scale(1.03)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Workflow Analysis",
      description:
        "Deep analysis of your RPA workflows with complexity scoring and best practice recommendations.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Code Review",
      description:
        "Automated code review with custom rules and industry standards validation.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Fast Processing",
      description:
        "Lightning-fast analysis powered by advanced algorithms and cloud infrastructure.",
    },
    {
      icon: <CodeIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Platform Support",
      description:
        "Support for UiPath, Blue Prism, and other major RPA platforms.",
    },
    {
      icon: <TrendingIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive analytics and insights to track your automation quality over time.",
    },
    {
      icon: <UploadIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Easy Upload",
      description:
        "Simple drag-and-drop interface for uploading and analyzing your workflows.",
    },
  ];

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 29,
      description: "Perfect for individuals",
      features: [
        "100 analyses/month",
        "Basic code review",
        "Email support",
        "1 user",
        "Community access",
      ],
      featured: false,
    },
    {
      id: "pro",
      name: "Professional",
      price: 99,
      description: "For growing teams",
      features: [
        "Unlimited analyses",
        "Advanced code review",
        "Priority support",
        "Up to 10 users",
        "Custom rules",
        "API access",
      ],
      featured: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 299,
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited users",
        "Dedicated support",
        "SLA guarantee",
        "Custom integrations",
        "On-premise deployment",
      ],
      featured: false,
    },
  ];

  return (
    <Box>
      {/* Navigation */}
      <StyledAppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, color: "#667eea" }}
          >
            Automation Analyzer
          </Typography>
          <Button
            sx={{ marginRight: 2, color: "#212121" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/signup")}
            sx={{
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)",
              },
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </StyledAppBar>

      {/* Hero Section */}
      <HeroSection id="hero">
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: "800px" }}>
            <HeroTitle>Analyze Your RPA Workflows with AI</HeroTitle>
            <HeroSubtitle>
              Intelligent automation analysis platform for UiPath, Blue Prism,
              and more. Get instant insights, code reviews, and quality metrics.
            </HeroSubtitle>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <CTAButton onClick={() => navigate("/signup")}>
                Start Free Trial
              </CTAButton>
              <Button
                variant="outlined"
                sx={{
                  padding: "16px 48px",
                  borderRadius: "50px",
                  fontSize: "18px",
                  fontWeight: 700,
                  textTransform: "none",
                  borderColor: "#ffffff",
                  color: "#ffffff",
                  "&:hover": {
                    borderColor: "#ffffff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                onClick={() =>
                  document
                    .getElementById("pricing")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                View Pricing
              </Button>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ padding: "100px 24px", background: "#ffffff" }} id="features">
        <Container maxWidth="lg">
          <SectionTitle>Powerful Features</SectionTitle>
          <Typography
            sx={{
              textAlign: "center",
              color: "#757575",
              fontSize: "1.25rem",
              marginBottom: "64px",
              maxWidth: "600px",
              margin: "0 auto 64px",
            }}
          >
            Everything you need to analyze and improve your automation workflows
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard>
                  <Box sx={{ marginBottom: "24px" }}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, marginBottom: "16px" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "#757575", lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box
        sx={{
          padding: "100px 24px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
        id="pricing"
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "3rem",
              textAlign: "center",
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.25rem",
              marginBottom: "64px",
              maxWidth: "600px",
              margin: "0 auto 64px",
            }}
          >
            Start analyzing today. Upgrade or downgrade anytime.
          </Typography>

          <Grid container spacing={4} alignItems="stretch">
            {plans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <PricingCard featured={plan.featured}>
                  {plan.featured && (
                    <Chip
                      label="MOST POPULAR"
                      icon={<StarIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        position: "absolute",
                        top: "-12px",
                        right: "24px",
                        background:
                          "linear-gradient(90deg, #ffd700 0%, #ffed4e 100%)",
                        color: "#000",
                        fontWeight: 700,
                      }}
                    />
                  )}

                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, marginBottom: "8px" }}
                  >
                    {plan.name}
                  </Typography>
                  <Typography sx={{ color: "#757575", marginBottom: "24px" }}>
                    {plan.description}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "3.5rem",
                      fontWeight: 800,
                      marginBottom: "24px",
                    }}
                  >
                    ${plan.price}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 400,
                        color: "#757575",
                      }}
                    >
                      /month
                    </Typography>
                  </Typography>

                  <List sx={{ marginBottom: "24px" }}>
                    {plan.features.map((feature, index) => (
                      <ListItem
                        key={index}
                        disablePadding
                        sx={{ padding: "8px 0" }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            fontSize: "14px",
                            color: "#424242",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate("/signup")}
                    sx={{
                      padding: "16px",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: 700,
                      textTransform: "none",
                      background: plan.featured
                        ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                        : "#212121",
                      "&:hover": {
                        background: plan.featured
                          ? "linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)"
                          : "#424242",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </PricingCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          padding: "100px 24px",
          background: "#ffffff",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, marginBottom: "24px" }}
          >
            Ready to Get Started?
          </Typography>
          <Typography
            sx={{ fontSize: "1.25rem", color: "#757575", marginBottom: "40px" }}
          >
            Join thousands of teams already using our platform to improve their
            automation workflows.
          </Typography>
          <CTAButton onClick={() => navigate("/signup")}>
            Start Your Free Trial
          </CTAButton>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{ padding: "40px 24px", background: "#212121", color: "#ffffff" }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ textAlign: "center" }}>
            © 2026 Automation Analyzer. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
