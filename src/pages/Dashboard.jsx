import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #EF7722, #FFB74D)",
          color: "white",
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          boxShadow: "0 6px 25px rgba(239, 119, 34, 0.4)",
          maxWidth: 600,
          width: "100%",
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <DashboardIcon sx={{ fontSize: 40, mr: 1 }} />
          <Typography
            variant="h4"
            fontWeight="bold"
            fontFamily="Poppins"
            sx={{ fontSize: { xs: "1.8rem", sm: "2.2rem" } }}
          >
            Welcome, Admin 👋
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          fontFamily="Poppins"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            color: "rgba(255,255,255,0.9)",
          }}
        >
          This is your dashboard.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
