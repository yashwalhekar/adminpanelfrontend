// src/pages/AddAds.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardMedia,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Divider,
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
      const res = await API.post("/ads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        open: true,
        message: res.data.message || "Ad created successfully!",
        severity: "success",
      });

      // Reset form
      setTitle("");
      setImage(null);
      setPreview(null);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Ad creation error:", error);
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
        p: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", md: "flex-start" },
      }}
    >
      {/* ✅ Page Heading */}
      <Typography
        variant="h4"
        FontFamily={"poppins"}
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1.8rem", sm: "2rem", md: "2.4rem" },
          fontWeight: "bold",
          textAlign: { xs: "center", md: "left" },
          color: "#EF7722",
          fontFamily: "poppins",
        }}
      >
        Add Advertisement
      </Typography>
      <Divider sx={{ mt: 3, color: "#FA812F" }} />

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 500 }}>
        <Stack spacing={isMobile ? 2 : 3}>
          {/* Ad Title */}
          <Typography
            variant="subtitle1"
            FontFamily={"poppins"}
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
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
          />

          {/* Start Date */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              mt: 1,
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
          />

          {/* End Date */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              mt: 1,
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
          />

          {/* Image Upload */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontFamily: "Sans-Serif ",
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
              FontFamily: "poppins",
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
                boxShadow: 3,
                borderRadius: 2,
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
              fontSize: { xs: "0.9rem", sm: "1rem" },
              py: { xs: 1, sm: 1.2 },
              width: { xs: "100%", sm: "50%" },
              alignSelf: { xs: "center", md: "flex-start" },
              FontFamily: "poppins",
              background: "linear-gradient(90deg, #FAA533, #EF7722)",
              "&:hover": {
                background: "linear-gradient(90deg, #FA812F, #ED3F27)",
              },
            }}
          >
            {loading ? "Submitting..." : "Submit Ad"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AddAds;
