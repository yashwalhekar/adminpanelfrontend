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
  Button,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
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

  // Fetch all taglines
  const fetchTaglines = async () => {
    try {
      const res = await API.get("/tagline");
      setTaglines(res.data || []);
    } catch (error) {
      console.error("Error fetching taglines:", error);
      setSnackbar({
        open: true,
        message: "Failed to load taglines",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchTaglines();
  }, []);

  // Toggle tagline active status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await API.put(`/tagline/${id}`, { isActive: !currentStatus });
      setSnackbar({
        open: true,
        message: "Status updated successfully",
        severity: "success",
      });
      fetchTaglines();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating status",
        severity: "error",
      });
    }
  };

  // Start editing a row
  const handleEditClick = (tagline) => {
    setEditingId(tagline._id);
    setEditValues({
      text: tagline.text,
      startDate: tagline.startDate ? tagline.startDate.split("T")[0] : "",
      endDate: tagline.endDate ? tagline.endDate.split("T")[0] : "",
      isActive: tagline.isActive,
    });
  };

  // Save edited tagline
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating tagline",
        severity: "error",
      });
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
  };

  // Delete tagline
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting tagline",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, fontFamily: "Poppins, sans-serif" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#EF7722",
          textAlign: { xs: "center", md: "left" },
          fontFamily: "poppins",
        }}
      >
        Tagline List
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#FAA533" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Text
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Start Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                End Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {taglines.length > 0 ? (
              taglines.map((tagline, index) => (
                <TableRow key={tagline._id} hover>
                  <TableCell>{index + 1}</TableCell>

                  {/* --- Editable or static cells --- */}
                  {editingId === tagline._id ? (
                    <>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          sx={{ fontFamily: "poppins" }}
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
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton color="error" onClick={handleCancel}>
                            <CloseIcon />
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
                          color="primary"
                          onChange={() =>
                            handleToggleStatus(tagline._id, tagline.isActive)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(tagline)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(tagline._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No taglines found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TaglineLists;
