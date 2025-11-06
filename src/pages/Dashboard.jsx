// src/pages/Dashboard.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Typography>Welcome to your admin dashboard!</Typography>
    </Box>
  );
};

export default Dashboard;
