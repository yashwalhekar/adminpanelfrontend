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
  Button,
  Alert,
  Snackbar,
  Tooltip,
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

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ✅ Fetch Ads
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

  // ✅ Toggle Active/Inactive
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

  // ✅ Delete Ad
  const handleDelete = async (adId) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      await API.delete(`/ads/${adId}`);
      setAds((prev) => prev.filter((ad) => ad._id !== adId));
      setSnackbar({
        open: true,
        message: "ad deleted successfully!!",
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

  // ✅ Start Editing Ad
  const startEditing = (ad) => {
    setEditingAd({ ...ad });
  };

  // ✅ Cancel Editing
  const cancelEditing = () => {
    setEditingAd(null);
  };

  // ✅ Save Updated Ad
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
        message: "ad updated successfully!!",
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
    <Box sx={{ p: { xs: 2, sm: 4, bgcolor: "#EBEBEB" } }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="#EF7722"
        textAlign="start"
        mb={3}
        fontFamily={"poppins"}
      >
        Advertisement List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
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
                          <Tooltip title="save">
                            <IconButton
                              color="success"
                              onClick={handleUpdate}
                              disabled={updatingId === ad._id}
                            >
                              <Save />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="close">
                            <IconButton color="error" onClick={cancelEditing}>
                              <Close />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="edit">
                            <IconButton
                              color="primary"
                              onClick={() => startEditing(ad)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="delete">
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
