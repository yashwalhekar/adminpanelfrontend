// src/components/TaglineLists.jsx
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
  Switch,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  TextField,
  Checkbox,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Close,
  ArrowBack,
  ArrowForward,
  ArrowForwardIos,
  ArrowBackIos,
} from "@mui/icons-material";
import API from "../service/api";

const TaglineLists = () => {
  const [taglines, setTaglines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [page, setPage] = useState(0);
  const rowsPerPage = 5; // desktop/tablet rows per page

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchTaglines();
  }, []);

  const fetchTaglines = async () => {
    try {
      const res = await API.get("/tagline");
      setTaglines(res.data || []);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load taglines",
        severity: "error",
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await API.put(`/tagline/${id}`, { isActive: !currentStatus });
      setSnackbar({
        open: true,
        message: "Status updated successfully",
        severity: "success",
      });
      fetchTaglines();
    } catch {
      setSnackbar({
        open: true,
        message: "Error updating status",
        severity: "error",
      });
    }
  };

  const handleEditClick = (tagline) => {
    setEditingId(tagline._id);
    setEditValues({
      text: tagline.text,
      startDate: tagline.startDate ? tagline.startDate.split("T")[0] : "",
      endDate: tagline.endDate ? tagline.endDate.split("T")[0] : "",
      isActive: tagline.isActive,
    });
  };

  const handleSave = async (id) => {
    try {
      await API.put(`/tagline/${id}`, editValues);
      setSnackbar({
        open: true,
        message: "Tagline updated successfully!",
        severity: "success",
      });
      setEditingId(null);
      fetchTaglines();
    } catch {
      setSnackbar({
        open: true,
        message: "Error updating tagline",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tagline?"))
      return;
    try {
      await API.delete(`/tagline/${id}`);
      setSnackbar({
        open: true,
        message: "Tagline deleted successfully",
        severity: "success",
      });
      fetchTaglines();
    } catch {
      setSnackbar({
        open: true,
        message: "Error deleting tagline",
        severity: "error",
      });
    }
  };

  const handleCancel = () => setEditingId(null);

  // pagination helpers
  const totalPages = Math.ceil(taglines.length / (isMobile ? 1 : rowsPerPage));

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  // Slice taglines for current page
  const paginatedTaglines = isMobile
    ? taglines.slice(page, page + 1)
    : taglines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, fontFamily: "Poppins" }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#EF7722",
          textAlign: isMobile ? "center" : "left",
          letterSpacing: "0.5px",
          fontFamily: "Poppins",
        }}
      >
        Tagline List
      </Typography>

      {/* ✅ Desktop & Tablet View */}
      {!isMobile && (
        <>
          <TableContainer
            component={Paper}
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(239, 119, 34, 0.1)",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  background: "linear-gradient(90deg, #FAA533, #EF7722)",
                }}
              >
                <TableRow>
                  {[
                    "#",
                    "Text",
                    "Start Date",
                    "End Date",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.9rem",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedTaglines.length > 0 ? (
                  paginatedTaglines.map((tagline, index) => (
                    <TableRow
                      key={tagline._id}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(250,165,51,0.05)",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(239,119,34,0.08)",
                          transition: "0.3s",
                        },
                      }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      {editingId === tagline._id ? (
                        <>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              value={editValues.text}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  text: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="date"
                              size="small"
                              fullWidth
                              value={editValues.startDate}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  startDate: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="date"
                              size="small"
                              fullWidth
                              value={editValues.endDate}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  endDate: e.target.value,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={editValues.isActive}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  isActive: e.target.checked,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Save">
                              <IconButton
                                color="success"
                                onClick={() => handleSave(tagline._id)}
                              >
                                <Save />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton color="error" onClick={handleCancel}>
                                <Close />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{tagline.text}</TableCell>
                          <TableCell>
                            {tagline.startDate
                              ? new Date(tagline.startDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {tagline.endDate
                              ? new Date(tagline.endDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={tagline.isActive}
                              color="warning"
                              onChange={() =>
                                handleToggleStatus(
                                  tagline._id,
                                  tagline.isActive
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleEditClick(tagline)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(tagline._id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No taglines found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Arrows */}
          {taglines.length > rowsPerPage && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <IconButton
                onClick={handlePrev}
                disabled={page === 0}
                sx={{ color: "#EF7722" }}
              >
                <ArrowBack fontSize="large" />
              </IconButton>
              <Typography
                sx={{ mx: 2, fontWeight: 600, fontFamily: "Poppins" }}
              >
                Page {page + 1} of {totalPages}
              </Typography>
              <IconButton
                onClick={handleNext}
                disabled={page >= totalPages - 1}
                sx={{ color: "#EF7722" }}
              >
                <ArrowForward fontSize="large" />
              </IconButton>
            </Box>
          )}
        </>
      )}

      {/* ✅ Mobile View */}
      {isMobile && paginatedTaglines.length > 0 && (
        <>
          <Card
            sx={{
              borderRadius: "14px",
              p: 2,
              background: "linear-gradient(180deg, #fff, #fffaf5)",
              border: "1px solid rgba(239,119,34,0.2)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 10px 24px rgba(239,119,34,0.25)",
              },
            }}
          >
            <CardContent>
              <Typography
                fontWeight="bold"
                sx={{ color: "#EF7722", fontSize: "1.1rem" }}
                fontFamily={"Poppins"}
              >
                {page + 1}. {paginatedTaglines[0].text}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }} fontFamily={"Poppins"}>
                <strong>Start:</strong>{" "}
                {paginatedTaglines[0].startDate
                  ? new Date(
                      paginatedTaglines[0].startDate
                    ).toLocaleDateString()
                  : "-"}
              </Typography>

              <Typography variant="body2" fontFamily={"Poppins"}>
                <strong>End:</strong>{" "}
                {paginatedTaglines[0].endDate
                  ? new Date(paginatedTaglines[0].endDate).toLocaleDateString()
                  : "-"}
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Switch
                  checked={paginatedTaglines[0].isActive}
                  color="warning"
                  onChange={() =>
                    handleToggleStatus(
                      paginatedTaglines[0]._id,
                      paginatedTaglines[0].isActive
                    )
                  }
                />
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(paginatedTaglines[0])}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(paginatedTaglines[0]._id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Mobile Pagination Arrows */}
          {taglines.length > 1 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
            >
              <IconButton
                onClick={handlePrev}
                disabled={page === 0}
                sx={{ color: "#EF7722" }}
              >
                <ArrowBackIos fontSize="medium" />
              </IconButton>
              <Typography
                sx={{ mx: 2, fontWeight: 600, fontFamily: "Poppins" }}
              >
                {page + 1}/{totalPages}
              </Typography>
              <IconButton
                onClick={handleNext}
                disabled={page >= totalPages - 1}
                sx={{ color: "#EF7722" }}
              >
                <ArrowForwardIos fontSize="medium" />
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            fontFamily: "Poppins, sans-serif",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaglineLists;
