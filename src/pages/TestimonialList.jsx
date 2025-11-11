// src/pages/TestimonialList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { Edit, Delete, Save, Close } from "@mui/icons-material";
import API from "../service/api";

const TestimonialList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await API.get("/testimonials");
      setTestimonials(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setSnackbar({
        open: true,
        message: "Failed to load testimonials",
        severity: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ✅ Handle Edit
  const handleEdit = (id) => {
    const testimonial = testimonials.find((item) => item._id === id);
    setEditId(id);
    setEditedData(testimonial);
  };

  // ✅ Handle Cancel
  const handleCancel = () => {
    setEditId(null);
    setEditedData({});
  };

  // ✅ Handle Change in textfields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  // ✅ Update Testimonial
  const handleSave = async (id) => {
    try {
      const res = await API.put(`/testimonials/${id}`, editedData);
      setSnackbar({
        open: true,
        message: "Updated successfully!",
        severity: "success",
      });
      setEditId(null);
      fetchTestimonials();
    } catch (error) {
      console.error("Error updating testimonial:", error);
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    }
  };

  // ✅ Delete Testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;
    try {
      await API.delete(`/testimonials/${id}`);
      setTestimonials(testimonials.filter((t) => t._id !== id));
      setSnackbar({
        open: true,
        message: "Deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      setSnackbar({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress color="warning" />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 5, p: 3 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        align="start"
        fontWeight="bold"
        color="#EF7722"
        mb={3}
        fontFamily="Poppins"
      >
        Manage Testimonials
      </Typography>

      <Divider sx={{ width: "100%", mb: 4, borderColor: "#FAA533" }} />

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#FAA533" }}>
              <TableCell sx={{ color: "white" }}>
                <strong>Full Name</strong>
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                <strong>Phone</strong>
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                <strong>City</strong>
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                <strong>Country</strong>
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                <strong>Feedback</strong>
              </TableCell>
              <TableCell align="center" sx={{ color: "white" }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {testimonials.map((item) => (
              <TableRow key={item._id}>
                {editId === item._id ? (
                  <>
                    <TableCell>
                      <TextField
                        name="fullName"
                        value={editedData.fullName || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="email"
                        value={editedData.email || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="phone"
                        value={editedData.phone || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="city"
                        value={editedData.city || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="country"
                        value={editedData.country || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="feedbackText"
                        value={editedData.feedbackText || ""}
                        onChange={handleChange}
                        size="small"
                        multiline
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleSave(item._id)}
                        color="success"
                      >
                        <Save />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="error">
                        <Close />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.feedbackText}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(item._id)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Snackbar for Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TestimonialList;
