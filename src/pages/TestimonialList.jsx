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
  Divider,
  Card,
  CardContent,
  CardActions,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Close,
  ArrowForward,
  ArrowBack,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
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
  const ITEMS_PER_PAGE = 5;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const ITEMS = isMobile ? 2 : ITEMS_PER_PAGE;
  const [page, setPage] = useState(1);

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

  // ✅ Handlers
  const handleEdit = (id) => {
    const testimonial = testimonials.find((item) => item._id === id);
    setEditId(id);
    setEditedData(testimonial);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = async (id) => {
    try {
      await API.put(`/testimonials/${id}`, editedData);
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
  const totalPages = Math.ceil(testimonials.length / ITEMS);
  const currentTestimonial = testimonials.slice(
    (page - 1) * ITEMS,
    page * ITEMS
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress color="warning" />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 5, p: isMobile ? 2 : 4 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        color="#EF7722"
        mb={3}
        fontFamily="Poppins"
        align={isMobile ? "center" : "start"}
      >
        Manage Testimonials
      </Typography>

      <Divider sx={{ width: "100%", mb: 4, borderColor: "#FAA533" }} />

      {/* ✅ TABLE for Desktop and Tablet */}
      {!isMobile ? (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size={isTablet ? "small" : "medium"}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#FAA533" }}>
                  {["Full Name", "City", "Country", "Feedback", "Actions"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        sx={{ color: "white", fontWeight: 600 }}
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {currentTestimonial.map((item) => (
                  <TableRow key={item._id} hover>
                    {editId === item._id ? (
                      <>
                        {["fullName", "city", "country", "feedbackText"].map(
                          (field) => (
                            <TableCell key={field}>
                              <TextField
                                name={field}
                                value={editedData[field] || ""}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                              />
                            </TableCell>
                          )
                        )}
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
                        <TableCell>{item.city}</TableCell>
                        <TableCell>{item.country}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 200,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Tooltip
                            title={item.feedbackText}
                            placement="top-start"
                          >
                            <span>{item.feedbackText}</span>
                          </Tooltip>
                        </TableCell>
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
          {totalPages > 1 && (
            <Box
              mt={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <IconButton
                onClick={handlePrev}
                disabled={page === 1}
                sx={{ color: "#EF7722" }}
              >
                <ArrowBack fontSize="large" />
              </IconButton>
              <Typography
                sx={{ mx: 2, fontWeight: 600, fontFamily: "Poppins" }}
              >
                Page {page} of {totalPages}
              </Typography>
              <IconButton
                onClick={handleNext}
                disabled={page === totalPages}
                sx={{ color: "#EF7722" }}
              >
                <ArrowForward fontSize="large" />
              </IconButton>
            </Box>
          )}
        </>
      ) : (
        <>
          <Stack spacing={2}>
            {currentTestimonial.map((item) => (
              <Card
                key={item._id}
                sx={{
                  borderLeft: "6px solid #EF7722",
                  borderRadius: 3,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  {editId === item._id ? (
                    <>
                      {["fullName", "city", "country"].map((field) => (
                        <TextField
                          key={field}
                          name={field}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          value={editedData[field] || ""}
                          onChange={handleChange}
                          size="small"
                          fullWidth
                          sx={{ mb: 1 }}
                        />
                      ))}
                      <TextField
                        name="feedbackText"
                        label="Feedback"
                        value={editedData.feedbackText || ""}
                        onChange={handleChange}
                        size="small"
                        multiline
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: "#EF7722", mb: 0.5 }}
                      >
                        {item.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.city}, {item.country}
                      </Typography>

                      <Tooltip title={item.feedbackText} placement="top-start">
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            color: "#555",
                            fontStyle: "italic",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                        >
                          “{item.feedbackText}”
                        </Typography>
                      </Tooltip>
                    </>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pb: 2 }}>
                  {editId === item._id ? (
                    <>
                      <IconButton
                        onClick={() => handleSave(item._id)}
                        color="success"
                      >
                        <Save />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="error">
                        <Close />
                      </IconButton>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </CardActions>
              </Card>
            ))}
          </Stack>
          {totalPages > 1 && (
            <Box
              mt={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <IconButton onClick={handlePrev} disabled={page === 1}>
                <ArrowBackIos />
              </IconButton>
              <Typography fontFamily="Poppins">
                Page {page} of {totalPages}
              </Typography>
              <IconButton onClick={handleNext} disabled={page === totalPages}>
                <ArrowForwardIos />
              </IconButton>
            </Box>
          )}
        </>
      )}

      {/* ✅ Snackbar */}
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
