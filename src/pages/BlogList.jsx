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
  IconButton,
  Switch,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Edit,
  Delete,
  ArrowBack,
  ArrowForward,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import API from "../service/api";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const ITEMS_PER_PAGE = isMobile ? 2 : 5;

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/blogs");

      const list = res.data.blogs || res.data || [];

      const normalized = list.map((b) => ({
        _id: b._id,
        title: b.title || "",
        creator: b.creator || "",
        content: b.content || "",
        imgUrl: b.imgUrl || "",
        status: b.status ?? false,
        createdAt: b.createdAt || "",
        slugs: b.slugs || "",
        timeChips: b.timeChips || "",
      }));

      setBlogs(normalized);
    } catch (error) {
      console.error("Failed to load blogs", error);
      setSnackbar({
        open: true,
        message: "Failed to load blogs",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Toggle status
  const handleStatusToggle = async (id) => {
    try {
      await API.put(`/blogs/${id}/status`);
      fetchBlogs();
      setSnackbar({
        open: true,
        message: "Status updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    }
  };

  // ✅ Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      fetchBlogs();
      setSnackbar({
        open: true,
        message: "Blog deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete blog",
        severity: "error",
      });
    }
  };

  // ✅ Open edit dialog
  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setOpenDialog(true);
  };

  // ✅ Update blog
  const handleUpdate = async () => {
    if (
      !selectedBlog.title ||
      !selectedBlog.creator ||
      !selectedBlog.content ||
      !selectedBlog.slugs
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all fields before saving",
        severity: "warning",
      });
      return;
    }

    try {
      await API.put(`/blogs/${selectedBlog._id}`, {
        title: selectedBlog.title,
        creator: selectedBlog.creator,
        content: selectedBlog.content,
        slugs: selectedBlog.slugs,
      });

      fetchBlogs();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Blog updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update blog",
        severity: "error",
      });
    }
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const currentBlogs = blogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  console.log(blogs);
  return (
    <Box p={3}>
      <Typography
        variant="h5"
        color="#EF7722"
        fontWeight="bold"
        textAlign="center"
        mb={3}
      >
        Blog List
      </Typography>
      <Divider sx={{ width: "100%", mb: 4, borderColor: "#FAA533" }} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        // ✅ Mobile Card View
        <>
          <Box display="flex" flexDirection="column" gap={2}>
            {currentBlogs.map((b) => (
              <Paper
                key={b._id}
                elevation={3}
                sx={{ p: 2, borderRadius: 2, borderLeft: "4px solid #EF7722" }}
              >
                <img
                  src={b.imgUrl}
                  alt="blog"
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <Typography variant="h6" color="#EF7722">
                  {b.slugs}
                </Typography>
                <Typography variant="h6" color="#EF7722">
                  {b.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Creator: {b.creator}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(b.createdAt).toLocaleDateString("en-GB")}
                </Typography>

                {/* <Typography variant="body2" color="text.secondary">
                  Updated: {new Date(b.updatedAt).toLocaleDateString("en-GB")}
                </Typography> */}

                <Typography variant="body2" sx={{ my: 1 }}>
                  {b.content.slice(0, 100)}...
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <Switch
                    checked={b.status}
                    onChange={() => handleStatusToggle(b._id)}
                    color="warning"
                  />
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(b)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(b._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

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
      ) : (
        // ✅ Desktop Table View
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#EF7722" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Slugs
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Creator
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Content
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="center"
                  >
                    Created At
                  </TableCell>
                  {/* <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="center"
                  >
                    Updated At
                  </TableCell> */}
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="center"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No blogs found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBlogs.map((b) => (
                    <TableRow key={b._id} hover>
                      {/* Image */}
                      <TableCell>
                        <img
                          src={b.imgUrl}
                          alt="blog"
                          style={{
                            width: 60,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      </TableCell>

                      <TableCell>{b.slugs}</TableCell>
                      <TableCell>{b.title}</TableCell>
                      <TableCell>{b.creator}</TableCell>

                      {/* Content */}
                      <TableCell>
                        {b.content.length > 80
                          ? b.content.slice(0, 80) + "..."
                          : b.content}
                      </TableCell>

                      {/* Created Timechip */}
                      <TableCell align="center">
                        {new Date(b.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      <TableCell align="center">
                        <Switch
                          checked={b.status}
                          onChange={() => handleStatusToggle(b._id)}
                          color="warning"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(b)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(b._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
      )}

      {/* ✅ Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle sx={{ color: "#EF7722", fontWeight: "bold" }}>
          Edit Blog
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Slugs"
            fullWidth
            value={selectedBlog?.slugs || ""}
            onChange={(e) =>
              setSelectedBlog({ ...selectedBlog, slugs: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={selectedBlog?.title || ""}
            onChange={(e) =>
              setSelectedBlog({ ...selectedBlog, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Creator"
            fullWidth
            value={selectedBlog?.creator || ""}
            onChange={(e) =>
              setSelectedBlog({ ...selectedBlog, creator: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            minRows={4}
            value={selectedBlog?.content || ""}
            onChange={(e) =>
              setSelectedBlog({ ...selectedBlog, content: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="warning">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BlogList;
