import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import API from "../service/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token, { expires: 0 });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#EF7722" }}>
        <Toolbar>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              flexGrow: 1,
              fontFamily: "Poppins",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #EF7722, #f4b942, #ffcc70)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={6}
            sx={{
              p: isMobile ? 3 : 5,
              width: isMobile ? "100%" : isTablet ? "70%" : "400px",
              borderRadius: 4,
              textAlign: "center",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "translateY(-5px)" },
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              mb={3}
              sx={{
                color: "#EF7722",
                fontFamily: "Poppins",
                textShadow: "1px 1px 2px rgba(239, 119, 34, 0.3)",
              }}
            >
              Welcome 👋
            </Typography>

            <Typography
              variant="body2"
              mb={3}
              sx={{ color: "#555", fontFamily: "Poppins" }}
            >
              Please log in to continue to your dashboard
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.2,
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  borderRadius: 2,
                  bgcolor: "#EF7722",
                  color: "#fff",
                  fontWeight: 600,
                  fontFamily: "Poppins",
                  boxShadow: "0 4px 14px rgba(239,119,34,0.4)",
                  "&:hover": {
                    bgcolor: "#e66e1f",
                    boxShadow: "0 6px 18px rgba(239,119,34,0.5)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <Typography
              variant="caption"
              display="block"
              mt={3}
              color="text.secondary"
              sx={{ fontFamily: "Poppins" }}
            >
              © {new Date().getFullYear()} Admin Portal. All rights reserved.
            </Typography>
          </Paper>
        </Fade>
      </Box>
    </>
  );
};

export default Login;
