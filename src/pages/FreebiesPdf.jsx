import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Box,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import API from "../service/api";
import { ArrowBackIos, ArrowForwardIos, Delete } from "@mui/icons-material";

const FreebiesPdf = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sentEmails, setSentEmails] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const totalPages = Math.ceil((data?.data?.length || 0) / recordsPerPage);

  const currentRecords = data?.data?.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Fetch Freebies
  const fetchRequest = async () => {
    try {
      setLoading(true);
      const res = await API.get("/freebies");
      setData(res.data);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  // Send Email Function
  const handleSendEmail = (email) => {
    const subject = encodeURIComponent("Request for Module PDF");
    const body = encodeURIComponent(
      `Hello,

Thank you for Requesting.
Here are your details:

Email: ${email}

If you need more resources, feel free to contact us.

Regards,
Your Company`
    );

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

    window.open(gmailURL, "_blank");

    setSentEmails((prev) => {
      const updated = { ...prev, [email]: true };
      localStorage.setItem("sentEmails", JSON.stringify(updated));
      return updated;
    });

    setSnackbar({
      open: true,
      message: "Email action opened in Gmail.",
      type: "success",
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/freebies/${id}`);
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((item) => item._id !== id),
      }));

      setSnackbar({
        open: true,
        message: "Request deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Delete failed", error);
      setSnackbar({
        open: true,
        message: "Failed to delete request!",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sentEmails");
    if (saved) {
      setSentEmails(JSON.parse(saved));
    }
  }, []);

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
        sx={{ color: "#EF7722", textAlign: isMobile ? "center" : "left" }}
      >
        Freebies Requests
      </Typography>

      {/* ---------- MOBILE VIEW CARDS ----------- */}
      {isMobile && (
        <Box display="flex" flexDirection="column" gap={2}>
          {currentRecords?.map((item) => (
            <Paper
              key={item._id}
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.8)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
              }}
            >
              <Typography fontWeight={600}>{item.email}</Typography>
              <Typography color="text.secondary">+{item.phone}</Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: sentEmails[item.email]
                      ? "#6c757d"
                      : "#EF7722",
                    borderRadius: 2,
                  }}
                  onClick={() => handleSendEmail(item.email)}
                >
                  {sentEmails[item.email] ? "Resend" : "Send"}
                </Button>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}

          {/* Pagination */}
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <IconButton onClick={handlePrev} disabled={currentPage === 1}>
              <ArrowBackIos />
            </IconButton>
            <Typography>
              {currentPage} / {totalPages}
            </Typography>
            <IconButton
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* ---------- DESKTOP/TABLE VIEW ----------- */}
      {!isMobile && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#EF7722" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Phone
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Action
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentRecords?.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: sentEmails[item.email]
                          ? "#6c757d"
                          : "#EF7722",
                      }}
                      onClick={() => handleSendEmail(item.email)}
                    >
                      {sentEmails[item.email] ? "Resend" : "Send Email"}
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box display="flex" justifyContent="center" gap={2} p={2}>
            <Button onClick={handlePrev} disabled={currentPage === 1}>
              Prev
            </Button>
            <Typography>
              {currentPage} / {totalPages}
            </Typography>
            <Button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </Button>
          </Box>
        </TableContainer>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FreebiesPdf;
