// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Drawer,
  Box,
  CssBaseline,
  useMediaQuery,
  useTheme,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ViewListIcon from "@mui/icons-material/ViewList";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // menu anchor
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // ✅ Open/close menu on avatar click
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/login");
  };

  // ✅ Drawer content
  const drawerContent = (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <List>
        <ListItemButton
          component={Link}
          to="/dashboard"
          onClick={() => isMobile && handleDrawerToggle()}
        >
          <DashboardIcon sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/add-ads"
          onClick={() => isMobile && handleDrawerToggle()}
        >
          <AddCircleOutlineIcon sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Add Ads" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/add-tagline"
          onClick={() => isMobile && handleDrawerToggle()}
        >
          <AddCircleOutlineIcon sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Add Taglines" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/allads"
          onClick={() => isMobile && handleDrawerToggle()}
        >
          <ViewListIcon sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Manage Ads" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ✅ AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#EF7722",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h5"
            noWrap
            component="div"
            fontFamily={"poppins"}
          >
            Admin Panel
          </Typography>

          {/* ✅ Avatar with Logout Menu */}
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{ bgcolor: "white", color: "#EF7722", fontWeight: "bold" }}
              >
                AD
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1, color: "red" }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              height: "100vh",
              top: "64px",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Navbar;
