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
  Divider,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Close,
  ArrowBackIos,
  ArrowForwardIos,
  ArrowBack,
  ArrowForward,
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

  const ITEMS = isMobile ? 2 : ITEMS_PER_PAGE;

  const fetchAds = async () => {
    try {
      const res = await API.get("/ads");
      // Check if backend sends { ads: [...] } or a plain array
      const adList = Array.isArray(res.data) ? res.data : res.data.ads;
      setAds(adList || []); // ✅ always an array
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

  // ✅ Pagination logic
  const totalPages = Math.ceil(ads.length / ITEMS);
  const currentAds = ads.slice((page - 1) * ITEMS, page * ITEMS);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

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
        fontFamily="Poppins"
      >
        Advertisement List
      </Typography>

      <Divider sx={{ width: "100%", mb: 4, borderColor: "#FAA533" }} />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : !isMobile ? (
        <>
          {/* ---------- DESKTOP TABLE VIEW ---------- */}
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
                    <TableRow key={ad._id} hover>
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

          {/* ---------- Desktop Pagination ---------- */}
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
          {/* ---------- MOBILE CARD VIEW ---------- */}
          <Box display="flex" flexDirection="column" gap={2}>
            {currentAds.map((ad) => {
              const isEditing = editingAd?._id === ad._id;
              return (
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
                      {isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editingAd.title}
                          onChange={(e) =>
                            setEditingAd({
                              ...editingAd,
                              title: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography variant="h6" fontFamily="Poppins">
                          {ad.title}
                        </Typography>
                      )}

                      <Avatar
                        src={ad.imageUrl}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </Box>

                    {isEditing ? (
                      <>
                        <TextField
                          fullWidth
                          type="date"
                          size="small"
                          value={editingAd.startDate.split("T")[0]}
                          onChange={(e) =>
                            setEditingAd({
                              ...editingAd,
                              startDate: e.target.value,
                            })
                          }
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          fullWidth
                          type="date"
                          size="small"
                          value={editingAd.endDate.split("T")[0]}
                          onChange={(e) =>
                            setEditingAd({
                              ...editingAd,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" fontFamily="Poppins">
                          Start: {new Date(ad.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" fontFamily="Poppins">
                          End: {new Date(ad.endDate).toLocaleDateString()}
                        </Typography>
                      </>
                    )}

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

                      {isEditing ? (
                        <Box>
                          <Tooltip title="Save">
                            <IconButton color="success" onClick={handleUpdate}>
                              <Save />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton color="error" onClick={cancelEditing}>
                              <Close />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box>
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
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* ---------- Mobile Pagination ---------- */}
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
