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
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  AddCircleOutline,
  ViewList,
  FormatQuote,
  Loyalty,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAds, setOpenAds] = useState(false);
  const [openTaglines, setOpenTaglines] = useState(false);
  const [openTestimonials, setOpenTestimonials] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/login");
  };

  // ✅ Drawer Content
  const drawerContent = (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <List>
        {/* Dashboard */}
        <ListItemButton
          component={Link}
          to="/dashboard"
          onClick={() => isMobile && handleDrawerToggle()}
        >
          <DashboardIcon sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Ads Management */}
        <ListItemButton onClick={() => setOpenAds(!openAds)}>
          <Loyalty sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Ads Management" />
          {openAds ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAds} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/add-ads"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <AddCircleOutline sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Add Ads" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/allads"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <ViewList sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Manage Ads" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Taglines Management */}
        <ListItemButton onClick={() => setOpenTaglines(!openTaglines)}>
          <FormatQuote sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Taglines Management" />
          {openTaglines ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openTaglines} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/add-tagline"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <AddCircleOutline sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Add Tagline" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Testimonials Management */}
        <ListItemButton onClick={() => setOpenTestimonials(!openTestimonials)}>
          <FormatQuote sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Testimonials" />
          {openTestimonials ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openTestimonials} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/add-testimonials"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <AddCircleOutline sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Add Testimonial" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/testimonials"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <ViewList sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Manage Testimonials" />
            </ListItemButton>
          </List>
        </Collapse>

        <Divider sx={{ my: 2 }} />
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#EF7722",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant={isMobile ? "h6" : "h5"}
            noWrap
            sx={{ fontFamily: "Poppins" }}
          >
            Admin Panel
          </Typography>

          {/* Avatar + Logout */}
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#EF7722",
                  fontWeight: "bold",
                  width: 35,
                  height: 35,
                  fontSize: 14,
                }}
              >
                AD
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1, color: "red" }} fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "#FFF8F0",
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
              top: "64px",
              bgcolor: "#FFF8F0",
              height: "100vh",
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
