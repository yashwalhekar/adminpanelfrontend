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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import API from "../service/api";

const FreebiesPdf = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentEmails, setSentEmails] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch Freebies
  const fetchRequest = async () => {
    try {
      setLoading(true);
      const res = await API.get("/freebies");
      setData(res.data);
    } catch (error) {
      console.error("Failed to load data", error);
      setSnackbar({
        open: true,
        message: "Failed to load Requests",
        severity: "error",
      });
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
        sx={{
          color: "#EF7722",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        Freebies Requests
      </Typography>

      {/* MOBILE VIEW — Modern Glass Cards */}
      {isMobile && (
        <Box display="flex" flexDirection="column" gap={2}>
          {data?.data?.map((item) => (
            <Paper
              key={item.id}
              sx={{
                p: 2,
                borderRadius: 3,
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.65)",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
              }}
            >
              <Typography fontWeight={600} color="text.primary">
                {item.email}
              </Typography>
              <Typography color="text.secondary">{item.phone}</Typography>

              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: sentEmails[item.email]
                    ? "#6c757d"
                    : "#EF7722",
                  fontWeight: 600,
                  borderRadius: 2,
                  ":hover": {
                    backgroundColor: sentEmails[item.email]
                      ? "#5a6268"
                      : "#d86516",
                  },
                }}
                onClick={() => handleSendEmail(item.email)}
              >
                {sentEmails[item.email] ? "Resend" : "Send Email"}
              </Button>
            </Paper>
          ))}
        </Box>
      )}

      {/* DESKTOP + TABLET VIEW — Premium Table */}
      {!isMobile && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 6px 25px rgba(0,0,0,0.10)",
          }}
        >
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
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.data?.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    transition: "0.2s",
                    ":hover": {
                      backgroundColor: "rgba(239, 119, 34, 0.06)",
                    },
                  }}
                >
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
                        fontWeight: 600,
                        borderRadius: 2,
                        ":hover": {
                          backgroundColor: sentEmails[item.email]
                            ? "#5a6268"
                            : "#d86516",
                        },
                      }}
                      onClick={() => handleSendEmail(item.email)}
                    >
                      {sentEmails[item.email] ? "Resend" : "Send Email"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FreebiesPdf;
