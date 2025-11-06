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
  CardActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit, Delete, Save, Close } from "@mui/icons-material";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchTaglines();
  }, []);

  const fetchTaglines = async () => {
    try {
      const res = await API.get("/tagline");
      setTaglines(res.data || []);
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating tagline",
        severity: "error",
      });
    }
  };

  const handleCancel = () => setEditingId(null);

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
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: "100vh" }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        color="#EF7722"
        mb={3}
        textAlign={isMobile ? "center" : "left"}
        fontFamily={"poppins"}
      >
        Tagline List
      </Typography>

      {/* Desktop Table */}
      {!isMobile && (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 3 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#FAA533" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  #
                </TableCell>
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
                  <TableCell colSpan={6} align="center">
                    No taglines found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile Cards */}
      {isMobile && taglines.length > 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          {taglines.map((tagline, index) => (
            <Card
              key={tagline._id}
              variant="outlined"
              sx={{ p: 2, boxShadow: 3 }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight="bold">
                    {index + 1}.{" "}
                    {editingId === tagline._id ? (
                      <TextField
                        value={editValues.text}
                        onChange={(e) =>
                          setEditValues({ ...editValues, text: e.target.value })
                        }
                        fullWidth
                        size="small"
                      />
                    ) : (
                      tagline.text
                    )}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Start:{" "}
                  {editingId === tagline._id ? (
                    <TextField
                      type="date"
                      value={editValues.startDate}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          startDate: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                  ) : tagline.startDate ? (
                    new Date(tagline.startDate).toLocaleDateString()
                  ) : (
                    "-"
                  )}
                </Typography>

                <Typography variant="body2" color="textSecondary" mb={1}>
                  End:{" "}
                  {editingId === tagline._id ? (
                    <TextField
                      type="date"
                      value={editValues.endDate}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          endDate: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                  ) : tagline.endDate ? (
                    new Date(tagline.endDate).toLocaleDateString()
                  ) : (
                    "-"
                  )}
                </Typography>

                {editingId === tagline._id ? (
                  <Box display="flex" gap={1} mt={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleSave(tagline._id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Switch
                      checked={tagline.isActive}
                      color="primary"
                      onChange={() =>
                        handleToggleStatus(tagline._id, tagline.isActive)
                      }
                    />
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(tagline)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(tagline._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

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
