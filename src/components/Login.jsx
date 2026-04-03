import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Avatar,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Shield as ShieldIcon,
  ArrowForward,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { authAPI, API_BASE_URL } from "../services/api";
import { tokenManager } from "../utils/tokenManager";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 460,
  width: "100%",
  padding: "40px 30px",
  borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
  background: "#ffffff",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.12)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "30px 20px",
    maxWidth: "95%",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  margin: "0 auto 20px",
  background: "linear-gradient(135deg, #5e6ff2 0%, #9d4edd 100%)",
  boxShadow: "0 8px 24px rgba(94, 111, 242, 0.3)",
  animation: "pulse 2s ease-in-out infinite",
  "@keyframes pulse": {
    "0%, 100%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
  },
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fafafa",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "transparent" },
    "&:hover": { backgroundColor: "#f5f5f5" },
    "&:hover fieldset": { borderColor: "#5e6ff2" },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px rgba(94, 111, 242, 0.1)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5e6ff2",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": { fontWeight: 500 },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)",
  borderRadius: "12px",
  padding: "14px 28px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  color: "#ffffff",
  boxShadow: "0 8px 24px rgba(94, 111, 242, 0.35)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #4c5ed7 0%, #8939c9 100%)",
    boxShadow: "0 12px 32px rgba(94, 111, 242, 0.45)",
    transform: "translateY(-2px)",
  },
  "&:active": { transform: "translateY(0)" },
  [theme.breakpoints.down("sm")]: {
    padding: "12px 24px",
    fontSize: "15px",
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    tokenManager.clear();

    if (!formData.email || !formData.password) {
      setSnackbarMessage("Please fill in all fields");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const data = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (data.api_key) {
        tokenManager.setApiKey(data.api_key);
      } else if (data.api_key_prefix && data.api_key_hash) {
        tokenManager.setApiKey(`${data.api_key_prefix} : ${data.api_key_hash}`);
      }

      setSnackbarMessage(`Welcome back, ${data.user?.full_name || data.user?.email || "User"}!`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      try {
        const projectsResponse = await fetch(`${API_BASE_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${tokenManager.getAuthToken()}`,
            "X-API-Key": tokenManager.getApiKey(),
          },
        });
        const projects = await projectsResponse.json();

        setTimeout(() => {
          if (projects && projects.length > 0) {
            navigate("/workspace");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } catch {
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      setSnackbarMessage(error.message || "Login failed. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      <StyledCard>
        <CardContent sx={{ padding: 0 }}>
          <StyledAvatar>
            <ShieldIcon sx={{ fontSize: { xs: 30, sm: 35 }, color: "#ffffff" }} />
          </StyledAvatar>

          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #5e6ff2 0%, #9d4edd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            Welcome to IAAP
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: "#757575",
              marginBottom: "40px",
              fontSize: { xs: "14px", sm: "15px" },
              px: { xs: 1, sm: 0 },
            }}
          >
            Intelligent Automation Analysis Platform
          </Typography>

          <form onSubmit={handleSubmit} autoComplete="off">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#212121",
                    fontSize: { xs: "13px", sm: "14px" },
                  }}
                >
                  Email
                </Typography>
                <StyledTextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#9e9e9e", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, marginBottom: "8px", color: "#212121" }}
                >
                  Password
                </Typography>
                <StyledTextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#9e9e9e", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: "#9e9e9e" }}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <GradientButton
                fullWidth
                type="submit"
                endIcon={<ArrowForward />}
                sx={{ marginTop: "8px" }}
              >
                Sign In
              </GradientButton>
            </Box>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: "24px", color: "#757575" }}
          >
            Don't have an account?{" "}
            <Link
              onClick={() => navigate("/signup")}
              component="button"
              type="button"
              underline="none"
              sx={{
                color: "#5e6ff2",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { color: "#9d4edd" },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </StyledCard>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
