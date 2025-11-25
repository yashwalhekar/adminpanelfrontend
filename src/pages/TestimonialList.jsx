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
  Switch,
  Button,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Close,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = isMobile ? 2 : 10;

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

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/testimonials/${id}/status`); // backend returns updated testimonial
      const updated = res.data.data; // this is the updated testimonial

      // update state for that specific testimonial without refetching whole list
      setTestimonials((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: updated.status } : item
        )
      );

      setSnackbar({
        open: true,
        message: `Status ${
          updated.status ? "Activated" : "Deactivated"
        } Successfully!`,
        severity: "success",
      });
    } catch (error) {
      console.log("Failed to update status", error.message);
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    }
  };

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
  const currentTestimonial = testimonials.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
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
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Table size={isTablet ? "small" : "medium"}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#EF7722" }}>
                  {[
                    "Full Name",
                    "City",
                    "Country",
                    "Feedback",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      sx={{ color: "white", fontWeight: 600, fontSize: "15px" }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {currentTestimonial.map((item) => (
                  <TableRow
                    key={item._id}
                    hover
                    sx={{
                      transition: "0.3s",
                      "&:hover": { backgroundColor: "#FFF4EA" },
                    }}
                  >
                    {editId === item._id ? (
                      <>
                        {["fullName", "city", "country", "feedbackText"].map(
                          (field) => (
                            <TableCell key={field} align="center">
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
                          <Switch checked={item.status} disabled />
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
                        <TableCell align="center">{item.fullName}</TableCell>
                        <TableCell align="center">{item.city}</TableCell>
                        <TableCell align="center">{item.country}</TableCell>

                        <TableCell align="center">
                          <Tooltip
                            title={item.feedbackText}
                            placement="top-start"
                          >
                            <Typography
                              sx={{
                                maxWidth: 220,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontStyle: "italic",
                              }}
                            >
                              “{item.feedbackText}”
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        <TableCell align="center">
                          <Switch
                            checked={item.status}
                            onChange={() => handleToggleStatus(item._id)}
                            color="success"
                          />
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
          {totalPages > 1 && !isMobile && (
            <Box
              mt={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Button
                variant="outlined"
                onClick={handlePrev}
                disabled={page === 1}
                sx={{ borderColor: "#EF7722", color: "#EF7722" }}
              >
                Prev
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  variant={page === i + 1 ? "contained" : "outlined"}
                  sx={{
                    background: page === i + 1 ? "#EF7722" : "transparent",
                    color: page === i + 1 ? "white" : "#EF7722",
                    minWidth: 40,
                    borderColor: "#EF7722",
                  }}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outlined"
                onClick={handleNext}
                disabled={page === totalPages}
                sx={{ borderColor: "#EF7722", color: "#EF7722" }}
              >
                Next
              </Button>
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
                  p: 1,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="#EF7722">
                    {item.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.city}, {item.country}
                  </Typography>

                  <Tooltip
                    title={item.feedbackText}
                    placement="top-start"
                    slotProps={{
                      tooltip: {
                        sx: {
                          whiteSpace: "normal",
                        },
                      },
                      popper: {
                        sx: { whiteSpace: "normal" },
                      },
                    }}
                  >
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <Box
                        sx={{
                          fontStyle: "italic",
                          fontSize: "14px",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        "{item.feedbackText}"
                      </Box>
                    </Box>
                  </Tooltip>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Status
                    </Typography>
                    <Switch
                      checked={item.status}
                      onChange={() => handleToggleStatus(item._id)}
                      color="success"
                    />
                  </Stack>
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end" }}>
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
