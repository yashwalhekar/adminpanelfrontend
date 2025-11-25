// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddAds from "./pages/AddAds";
import AdList from "./pages/AdList";
import Login from "./pages/Login";
import Tagline from "./pages/Tagline";
import Testimonials from "./pages/Testimonials";
import TestimonialList from "./pages/TestimonialList";
import AddBlogs from "./pages/AddBlogs";
import BlogList from "./pages/BlogList";
import Viewers from "./pages/Viewers";
import FreebiesPdf from "./pages/FreebiesPdf";

// ✅ ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  const decoded = jwtDecode(token);
  if (decoded.exp * 1000 < Date.now()) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Route */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Box sx={{ display: "flex" }}>
                {/* ✅ Sidebar/Navbar */}
                <Navbar />

                {/* ✅ Main Content Area */}
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: "64px",
                    ml: { md: "3px" },
                    minHeight: "100vh",
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-ads" element={<AddAds />} />
                    <Route path="/allads" element={<AdList />} />
                    <Route path="/add-tagline" element={<Tagline />}></Route>
                    <Route
                      path="/add-testimonials"
                      element={<Testimonials />}
                    ></Route>
                    <Route
                      path="/testimonials"
                      element={<TestimonialList />}
                    ></Route>
                    <Route path="/add-blogs" element={<AddBlogs />}></Route>
                    <Route path="/all-blogs" element={<BlogList />}></Route>
                    <Route path="/viewers" element={<Viewers />}></Route>
                    <Route
                      path="/modulerequests"
                      element={<FreebiesPdf />}
                    ></Route>
                  </Routes>
                </Box>
              </Box>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
