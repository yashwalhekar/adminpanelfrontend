// src/pages/Tagline.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import API from "../service/api";
import TaglineLists from "./TaglineLists";

const Tagline = () => {
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [refreshList, setRefreshList] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(`/tagline`, {
        text,
        startDate,
        endDate,
        isActive,
      });

      setSnackbar({
        open: true,
        message: res.data.message || "Tagline created successfully!",
        severity: "success",
      });

      // Reset form
      setText("");
      setStartDate("");
      setEndDate("");
      setIsActive(false);
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
        display: "flex",
        flexDirection: "column",

        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1.8rem", sm: "2rem", md: "2.2rem" },
          fontWeight: 600,
          textAlign: { xs: "center", md: "left" },
          color: "#EF7722",
          fontFamily: "Poppins",
        }}
      >
        Add Tagline
      </Typography>

      {/* Form Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 500,
          mx: { xs: "auto", md: 0 },
        }}
      >
        <Stack spacing={2.5}>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: "1rem",
              color: "#333",
            }}
          >
            Tagline Details
          </Typography>

          <TextField
            size="small"
            label="Tagline Text"
            fullWidth
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{ style: { fontFamily: "Poppins, sans-serif" } }}
            InputLabelProps={{ style: { fontFamily: "Poppins, sans-serif" } }}
          />

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
              InputProps={{ style: { fontFamily: "Poppins, sans-serif" } }}
            />

            <TextField
              size="small"
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputProps={{ style: { fontFamily: "Poppins, sans-serif" } }}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              textTransform: "none",
              fontFamily: "sans-serif",
              fontWeight: 600,
              py: 1.1,
              background: "linear-gradient(90deg, #FAA533, #EF7722)",
              "&:hover": {
                background: "linear-gradient(90deg, #FA812F, #ED3F27)",
              },
            }}
            size="small"
          >
            Create Tagline
          </Button>
        </Stack>
      </Box>
      <Divider sx={{ mt: 4 }} />
      <TaglineLists key={refreshList} />
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tagline;
