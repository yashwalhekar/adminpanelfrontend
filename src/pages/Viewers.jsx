import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  TextField,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  Divider,
  Button,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import API from "../service/api";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const Viewers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const totalPages = Math.ceil(rows.length / recordsPerPage);

  const currentRecords = rows.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/users");
        setRows(res.data.data);
      } catch (error) {
        console.error("Error fetching viewers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setRows(rows.filter((r) => r._id !== id));
    } catch (error) {
      console.log("Delete error", error);
    }
  };

  const handleEdit = (row) => {
    setEditId(row._id);
    setEditData({ ...row });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      await API.put(`/users/${editId}`, editData);

      setRows(rows.map((item) => (item._id === editId ? editData : item)));

      setEditId(null);
      setEditData({});
    } catch (error) {
      console.log("Update error", error);
    }
  };

  return (
    <Box p={2}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        mb={2}
        color="#EF7722"
        textAlign={isMobile ? "center" : "start"}
      >
        Viewers List
      </Typography>
      <Divider sx={{ width: "100%", mb: 4, borderColor: "#FAA533" }} />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {(isMobile || isTablet) && (
            <Stack spacing={2}>
              {currentRecords.map((row) => {
                const isEditing = editId === row._id;

                return (
                  <Card
                    key={row._id}
                    elevation={6}
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <CardContent>
                      {/* Name Field */}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Full Name"
                          size="small"
                          value={editData.fullname}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              fullname: e.target.value,
                            })
                          }
                          sx={{ mb: 2 }}
                        />
                      ) : (
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#EF7722"
                          sx={{ mb: 1 }}
                        >
                          {row.fullname}
                        </Typography>
                      )}

                      {/* Country */}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Country"
                          size="small"
                          sx={{ mb: 2 }}
                          value={editData.country}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              country: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography>
                          <strong>Country:</strong> {row.country}
                        </Typography>
                      )}

                      {/* City */}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="City"
                          size="small"
                          sx={{ mb: 2 }}
                          value={editData.city}
                          onChange={(e) =>
                            setEditData({ ...editData, city: e.target.value })
                          }
                        />
                      ) : (
                        <Typography>
                          <strong>City:</strong> {row.city}
                        </Typography>
                      )}

                      {/* Email */}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Email"
                          size="small"
                          sx={{ mb: 2 }}
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                        />
                      ) : (
                        <Typography>
                          <strong>Email:</strong> {row.email}
                        </Typography>
                      )}

                      {/* Phone */}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Phone"
                          size="small"
                          sx={{ mb: 2 }}
                          value={editData.phone}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                        />
                      ) : (
                        <Typography>
                          <strong>Phone:</strong> {row.phone}
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                      >
                        {isEditing ? (
                          <>
                            <IconButton onClick={handleSave}>
                              <SaveIcon sx={{ color: "green" }} />
                            </IconButton>
                            <IconButton onClick={handleCancel}>
                              <CloseIcon sx={{ color: "red" }} />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => handleEdit(row)}>
                              <EditIcon sx={{ color: "green" }} />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row._id)}>
                              <DeleteIcon sx={{ color: "red" }} />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination Mobile */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                mt={1}
              >
                <IconButton
                  variant="outlined"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ArrowBackIos />
                </IconButton>
                <Typography fontWeight="600">
                  {currentPage} / {totalPages}
                </Typography>
                <IconButton
                  variant="outlined"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ArrowForwardIos />
                </IconButton>
              </Box>
            </Stack>
          )}

          {/* Desktop Table */}
          {!isMobile && !isTablet && (
            <>
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead sx={{ background: "#EF7722" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Full Name</TableCell>
                      <TableCell sx={{ color: "white" }}>Country</TableCell>
                      <TableCell sx={{ color: "white" }}>City</TableCell>
                      <TableCell sx={{ color: "white" }}>Email</TableCell>
                      <TableCell sx={{ color: "white" }}>Phone</TableCell>
                      <TableCell sx={{ color: "white" }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentRecords.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.fullName}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon color="success" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row._id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination Desktop */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                mt={2}
              >
                <Button
                  variant="outlined"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <Typography fontWeight="600">
                  {currentPage} / {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Viewers;
