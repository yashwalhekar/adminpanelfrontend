import { useState } from "react";
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
  Article,
  Group,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Collapses
  const [openAds, setOpenAds] = useState(false);
  const [openTaglines, setOpenTaglines] = useState(false);
  const [openTestimonials, setOpenTestimonials] = useState(false);
  const [openBlogs, setOpenBlogs] = useState(false);
  const [openReachedUsers, setOpenReachedUsers] = useState(false);
  const [openRequests, setOpenRequests] = useState(false);

  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/login");
  };

  // Drawer items
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

        {/* --------------------- Ads --------------------- */}
        <ListItemButton onClick={() => setOpenAds(!openAds)}>
          <Loyalty sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Ads Management" />
          {openAds ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openAds} unmountOnExit>
          <List disablePadding>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/add-ads"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <AddCircleOutline sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Add Ad" />
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

        {/* --------------------- Taglines --------------------- */}
        <ListItemButton onClick={() => setOpenTaglines(!openTaglines)}>
          <FormatQuote sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Taglines Management" />
          {openTaglines ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openTaglines} unmountOnExit>
          <List disablePadding>
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

        {/* --------------------- Testimonials --------------------- */}
        <ListItemButton onClick={() => setOpenTestimonials(!openTestimonials)}>
          <FormatQuote sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Testimonials" />
          {openTestimonials ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openTestimonials} unmountOnExit>
          <List disablePadding>
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

        {/* --------------------- Blogs --------------------- */}
        <ListItemButton onClick={() => setOpenBlogs(!openBlogs)}>
          <Article sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Blogs" />
          {openBlogs ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openBlogs} unmountOnExit>
          <List disablePadding>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/add-blogs"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <AddCircleOutline sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Add Blog" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/all-blogs"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <ViewList sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Manage Blogs" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* --------------------- Reached Users --------------------- */}
        <ListItemButton onClick={() => setOpenReachedUsers(!openReachedUsers)}>
          <Group sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Reached Users" />
          {openReachedUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openReachedUsers} unmountOnExit>
          <List disablePadding>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/viewers"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <ViewList sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Viewers List" />
            </ListItemButton>
          </List>
        </Collapse>

        {/*-------------------- Module Requests-------------------- */}

        <ListItemButton onClick={() => setOpenRequests(!openRequests)}>
          <Group sx={{ mr: 2, color: "#FAA533" }} />
          <ListItemText primary="Freebies" />
          {openRequests ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openRequests} unmountOnExit>
          <List disablePadding>
            <ListItemButton
              sx={{ pl: 8 }}
              component={Link}
              to="/moduleRequests"
              onClick={() => isMobile && handleDrawerToggle()}
            >
              <ViewList sx={{ mr: 2, color: "#FAA533" }} />
              <ListItemText primary="Freebies" />
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

      {/* AppBar */}
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

          <Typography variant="h5" sx={{ fontFamily: "Poppins" }}>
            Admin Panel
          </Typography>

          {/* Profile + Logout */}
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              sx={{
                bgcolor: "white",
                color: "#EF7722",
                fontWeight: "bold",
                width: 35,
                height: 35,
              }}
            >
              AD
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1, color: "red" }} fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
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
              bgcolor: "#FFF8F0",
              top: "64px",
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
