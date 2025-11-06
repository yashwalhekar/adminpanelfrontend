// src/components/Layout.jsx
import React from "react";
import { Box, Toolbar } from "@mui/material";

const drawerWidth = 240;

const Layout = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        mt: { xs: 7, sm: 8 }, // offset for AppBar
        ml: { md: `${drawerWidth}px` }, // offset for permanent drawer on desktop
      }}
    >
      <Toolbar /> {/* creates space for the AppBar */}
      {children}
    </Box>
  );
};

export default Layout;
