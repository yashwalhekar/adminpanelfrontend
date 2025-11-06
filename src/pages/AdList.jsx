// src/pages/AdList.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Avatar,
  CircularProgress,
  Switch,
  IconButton,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Edit, Delete, Save, Close } from "@mui/icons-material";
import API from "../service/api";

const AdList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingAd, setEditingAd] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchAds = async () => {
    try {
      const res = await API.get("/ads");
      setAds(res.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleToggle = async (adId, currentStatus) => {
    try {
      setUpdatingId(adId);
      if (!currentStatus) {
        const activeAds = ads.filter((ad) => ad.isActive && ad._id !== adId);
        for (const activeAd of activeAds) {
          await API.put(`/ads/${activeAd._id}/status`, { isActive: false });
        }
      }
      await API.put(`/ads/${adId}/status`, { isActive: !currentStatus });

      await fetchAds();
      setSnackbar({
        open: true,
        message: "Status updated successfully!!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating ad status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (adId) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    try {
      await API.delete(`/ads/${adId}`);
      setAds((prev) => prev.filter((ad) => ad._id !== adId));
      setSnackbar({
        open: true,
        message: "Ad deleted successfully!!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting ad:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete ad",
        severity: "error",
      });
    }
  };

  const startEditing = (ad) => {
    setEditingAd({ ...ad });
  };

  const cancelEditing = () => {
    setEditingAd(null);
  };

  const handleUpdate = async () => {
    if (!editingAd.title || !editingAd.startDate || !editingAd.endDate) {
      setSnackbar({
        open: true,
        message: "Please fill all fields!",
        severity: "warning",
      });
      return;
    }
    try {
      setUpdatingId(editingAd._id);
      await API.put(`/ads/${editingAd._id}`, {
        title: editingAd.title,
        startDate: editingAd.startDate,
        endDate: editingAd.endDate,
      });
      await fetchAds();
      setEditingAd(null);
      setSnackbar({
        open: true,
        message: "Ad updated successfully!!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating ad:", error);
      setSnackbar({
        open: true,
        message: "Failed to update ad",
        severity: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="#EF7722"
        mb={3}
        fontFamily="poppins"
        textAlign={isMobile ? "center" : "left"}
      >
        Advertisement List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : !isMobile ? (
        // Desktop Table
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FAA533" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Title
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Image
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Start Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  End Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
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
              {ads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No advertisements found.
                  </TableCell>
                </TableRow>
              ) : (
                ads.map((ad) => (
                  <TableRow key={ad._id} hover>
                    <TableCell>
                      {editingAd && editingAd._id === ad._id ? (
                        <TextField
                          fullWidth
                          value={editingAd.title}
                          onChange={(e) =>
                            setEditingAd({
                              ...editingAd,
                              title: e.target.value,
                            })
                          }
                        />
                      ) : (
                        ad.title
                      )}
                    </TableCell>

                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={ad.imageUrl}
                        alt={ad.title}
                        sx={{ width: 60, height: 60 }}
                      />
                    </TableCell>

                    <TableCell>
                      {editingAd && editingAd._id === ad._id ? (
                        <TextField
                          type="date"
                          value={
                            new Date(editingAd.startDate)
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(e) =>
                            setEditingAd({
                              ...editingAd,
                              startDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        new Date(ad.startDate).toLocaleDateString()
                      )}
                    </TableCell>

                    <TableCell>
                      {editingAd && editingAd._id === ad._id ? (
                        <TextField
                          type="date"
                          value={
                            new Date(editingAd.endDate)
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(e) =>
                            setEditingAd({
                              ...editingAd,
                              endDate: e.target.value,
                            })
                          }
                        />
                      ) : (
                        new Date(ad.endDate).toLocaleDateString()
                      )}
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={ad.isActive}
                        onChange={() => handleToggle(ad._id, ad.isActive)}
                        color="success"
                        disabled={updatingId === ad._id}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {editingAd && editingAd._id === ad._id ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton
                              color="success"
                              onClick={handleUpdate}
                              disabled={updatingId === ad._id}
                            >
                              <Save />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton color="error" onClick={cancelEditing}>
                              <Close />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() => startEditing(ad)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(ad._id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Mobile / Tablet Cards
        <Box display="flex" flexDirection="column" gap={2}>
          {ads.map((ad) => (
            <Card key={ad._id} variant="outlined" sx={{ p: 2, boxShadow: 3 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  {editingAd && editingAd._id === ad._id ? (
                    <TextField
                      value={editingAd.title}
                      onChange={(e) =>
                        setEditingAd({ ...editingAd, title: e.target.value })
                      }
                      fullWidth
                      size="small"
                    />
                  ) : (
                    <Typography variant="h6" fontWeight="bold">
                      {ad.title}
                    </Typography>
                  )}
                  <Avatar
                    src={ad.imageUrl}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                  />
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Start:{" "}
                  {editingAd && editingAd._id === ad._id ? (
                    <TextField
                      type="date"
                      value={editingAd.startDate}
                      onChange={(e) =>
                        setEditingAd({
                          ...editingAd,
                          startDate: e.target.value,
                        })
                      }
                      size="small"
                      fullWidth
                    />
                  ) : (
                    new Date(ad.startDate).toLocaleDateString()
                  )}
                </Typography>

                <Typography variant="body2" color="textSecondary" mb={1}>
                  End:{" "}
                  {editingAd && editingAd._id === ad._id ? (
                    <TextField
                      type="date"
                      value={editingAd.endDate}
                      onChange={(e) =>
                        setEditingAd({ ...editingAd, endDate: e.target.value })
                      }
                      size="small"
                      fullWidth
                    />
                  ) : (
                    new Date(ad.endDate).toLocaleDateString()
                  )}
                </Typography>

                {editingAd && editingAd._id === ad._id ? (
                  <Box display="flex" gap={1} mt={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleUpdate}
                      disabled={updatingId === ad._id}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={cancelEditing}
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
                      checked={ad.isActive}
                      onChange={() => handleToggle(ad._id, ad.isActive)}
                      color="success"
                      disabled={updatingId === ad._id}
                    />
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => startEditing(ad)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(ad._id)}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdList;
