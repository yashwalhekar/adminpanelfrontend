// src/pages/Tagline.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import API from "../service/api";
import TaglineLists from "./TaglineLists";

const Tagline = () => {
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [refreshList, setRefreshList] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/tagline`, {
        text,
        startDate,
        endDate,
      });

      setSnackbar({
        open: true,
        message: res.data.message || "Tagline created successfully!",
        severity: "success",
      });

      setText("");
      setStartDate("");
      setEndDate("");
      setRefreshList((prev) => !prev);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error creating tagline",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#fff",
      }}
    >
      {/* ✅ Page Heading */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: { xs: 2, sm: 3 },

          fontWeight: 700,
          textAlign: { xs: "center", md: "left" },
          color: "#EF7722",
          fontFamily: "Poppins",
          letterSpacing: "0.5px",
        }}
      >
        Add Tagline
      </Typography>

      <Divider sx={{ width: "100%", mb: 4, borderColor: "#FAA533" }} />

      {/* ✅ Beautiful Glass-like Card */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.9)",
          maxWidth: 500,
          mx: { xs: "auto", md: 0 },
          border: "1px solid rgba(239, 119, 34, 0.2)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px rgba(239, 119, 34, 0.25)",
          },
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {/* Tagline Text */}
            <TextField
              size="small"
              label="Tagline Text"
              fullWidth
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              InputProps={{
                style: { fontFamily: "Poppins, sans-serif" },
              }}
              InputLabelProps={{
                style: { fontFamily: "Poppins, sans-serif" },
              }}
            />

            {/* Date Range */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <TextField
                size="small"
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputProps={{
                  style: { fontFamily: "Poppins, sans-serif" },
                }}
              />

              <TextField
                size="small"
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputProps={{
                  style: { fontFamily: "Poppins, sans-serif" },
                }}
              />
            </Stack>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                py: 1.2,
                mt: 1,
                borderRadius: "10px",
                fontSize: "0.95rem",
                background: "linear-gradient(90deg, #FAA533, #EF7722)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(90deg, #FA812F, #ED3F27)",
                  transform: "scale(1.02)",
                },
              }}
            >
              Create Tagline
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Divider sx={{ mt: 5, mb: 3, borderColor: "#FAA533" }} />

      {/* ✅ Tagline List Section */}
      <TaglineLists key={refreshList} />

      {/* ✅ Snackbar Feedback */}
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
            fontSize: "0.9rem",
            borderRadius: "8px",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tagline;
