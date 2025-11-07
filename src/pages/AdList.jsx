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
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  TextField,
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

const ITEMS_PER_PAGE = 5;

const AdList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

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
        message: "Status updated successfully!",
        severity: "success",
      });
    } catch (error) {
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
        message: "Ad deleted successfully!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to delete ad",
        severity: "error",
      });
    }
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
      await API.put(`/ads/${editingAd._id}`, editingAd);
      await fetchAds();
      setEditingAd(null);
      setSnackbar({
        open: true,
        message: "Ad updated successfully!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update ad",
        severity: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const startEditing = (ad) => setEditingAd({ ...ad });
  const cancelEditing = () => setEditingAd(null);

  // Pagination Logic
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentAds = ads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(ads.length / ITEMS_PER_PAGE);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff, #fdf4eb)",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        color="#EF7722"
        mb={3}
        textAlign={isMobile ? "center" : "left"}
        fontFamily="Poppins, sans-serif"
      >
        Advertisement List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : !isMobile ? (
        <>
          <TableContainer
            component={Paper}
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#FAA533" }}>
                  {[
                    "Title",
                    "Image",
                    "Start Date",
                    "End Date",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        textAlign: head === "Actions" ? "center" : "left",
                        fontFamily: "Poppins",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No advertisements found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentAds.map((ad) => (
                    <TableRow
                      key={ad._id}
                      hover
                      sx={{
                        transition: "background 0.3s",
                        "&:hover": { backgroundColor: "#fff8f1" },
                      }}
                    >
                      <TableCell>
                        {editingAd?._id === ad._id ? (
                          <TextField
                            fullWidth
                            value={editingAd.title}
                            onChange={(e) =>
                              setEditingAd({
                                ...editingAd,
                                title: e.target.value,
                              })
                            }
                            size="small"
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
                        {editingAd?._id === ad._id ? (
                          <TextField
                            type="date"
                            value={editingAd.startDate.split("T")[0]}
                            onChange={(e) =>
                              setEditingAd({
                                ...editingAd,
                                startDate: e.target.value,
                              })
                            }
                            size="small"
                          />
                        ) : (
                          new Date(ad.startDate).toLocaleDateString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAd?._id === ad._id ? (
                          <TextField
                            type="date"
                            value={editingAd.endDate.split("T")[0]}
                            onChange={(e) =>
                              setEditingAd({
                                ...editingAd,
                                endDate: e.target.value,
                              })
                            }
                            size="small"
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
                        {editingAd?._id === ad._id ? (
                          <>
                            <Tooltip title="Save">
                              <IconButton
                                color="success"
                                onClick={handleUpdate}
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

          {/* Pagination Arrows */}
          {totalPages > 1 && (
            <Box
              mt={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <IconButton
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                <ArrowBackIos />
              </IconButton>
              <Typography fontFamily="Poppins">
                Page {page} of {totalPages}
              </Typography>
              <IconButton
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>
          )}
        </>
      ) : (
        // Mobile Cards
        <Box display="flex" flexDirection="column" gap={2}>
          {ads.map((ad) => (
            <Card
              key={ad._id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6" fontFamily="Poppins">
                    {ad.title}
                  </Typography>
                  <Avatar
                    src={ad.imageUrl}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                  />
                </Box>
                <Typography variant="body2" fontFamily="Poppins">
                  Start: {new Date(ad.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" fontFamily="Poppins">
                  End: {new Date(ad.endDate).toLocaleDateString()}
                </Typography>
                <Box
                  mt={1}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
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
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdList;
