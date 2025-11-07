// src/pages/AddAds.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardMedia,
  Divider,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import API from "../service/api";

const AddAds = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image || !startDate || !endDate) {
      setSnackbar({
        open: true,
        message: "Please fill all fields and upload an image!",
        severity: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);

      const res = await API.post("/ads", formData);

      setSnackbar({
        open: true,
        message: res.data.message || "Ad created successfully!",
        severity: "success",
      });

      setTitle("");
      setImage(null);
      setPreview(null);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create ad",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", md: "flex-start" },
      }}
    >
      {/* Page Heading */}
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 2, sm: 3 },
          fontWeight: "bold",
          fontFamily: "'Poppins'",
          textAlign: { xs: "center", md: "left" },
          color: "#EF7722",
          letterSpacing: 0.5,
          fontSize: { xs: 25 },
        }}
      >
        Add Advertisement
      </Typography>

      <Divider sx={{ width: "100%", mb: 4, borderColor: "#FAA533" }} />

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 500 }}>
        <Stack spacing={isMobile ? 2 : 3}>
          {/* Ad Title */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Ad Title
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter ad title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />

          {/* Start Date */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Start Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />

          {/* End Date */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            End Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />

          {/* Image Upload */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontFamily: "'Poppins', sans-serif",
              mt: 2,
            }}
          >
            Upload Image
          </Typography>
          <Button
            variant="contained"
            component="label"
            size={isMobile ? "small" : "medium"}
            sx={{
              width: { xs: "100%", sm: "50%" },
              background: "linear-gradient(90deg, #FAA533, #EF7722)",
              "&:hover": {
                background: "linear-gradient(90deg, #FA812F, #ED3F27)",
              },
              fontFamily: "'Poppins', sans-serif",
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              py: { xs: 1, sm: 1.2 },
            }}
          >
            Choose File
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {/* Image Preview */}
          {preview && (
            <Card
              sx={{
                maxWidth: { xs: "100%", sm: 320 },
                mt: 2,
                borderRadius: 3,
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardMedia
                component="img"
                image={preview}
                alt="Ad Preview"
                sx={{
                  height: { xs: 180, sm: 220 },
                  objectFit: "cover",
                }}
              />
            </Card>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              width: { xs: "100%", sm: "50%" },
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(90deg, #FAA533, #EF7722)",
              "&:hover": {
                background: "linear-gradient(90deg, #FA812F, #ED3F27)",
              },
              borderRadius: 2,
              py: { xs: 1, sm: 1.2 },
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              alignSelf: { xs: "center", md: "flex-start" },
            }}
          >
            {loading ? "Submitting..." : "Submit Ad"}
          </Button>
        </Stack>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", fontFamily: "'Poppins', sans-serif" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAds;
