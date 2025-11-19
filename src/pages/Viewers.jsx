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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import API from "../service/api";

const Viewers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

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

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setRows(rows.filter((r) => r._id !== id));
    } catch (error) {
      console.log("Delete error", error);
    }
  };

  // --------------- EDIT MODE ----------------
  const handleEdit = (row) => {
    setEditId(row._id);
    setEditData({ ...row });
  };

  // --------------- CANCEL EDIT ----------------
  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  // -------------- SAVE EDITED DATA ----------------
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
          {/* ---------------- MOBILE & TABLET (MODERN EDITABLE CARD VIEW) ---------------- */}
          {(isMobile || isTablet) && (
            <Stack spacing={2}>
              {rows.map((row) => {
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
                      {/* ---------------- NAME ---------------- */}
                      {isEditing ? (
                        <TextField
                          fullWidth
                          label="Full Name"
                          size="small"
                          sx={{ mb: 2 }}
                          value={editData.fullName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              fullname: e.target.value,
                            })
                          }
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

                      {/* ---------------- COUNTRY ---------------- */}
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
                        <Typography sx={{ mb: 0.5 }}>
                          <strong>Country:</strong> {row.country}
                        </Typography>
                      )}

                      {/* ---------------- CITY ---------------- */}
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
                        <Typography sx={{ mb: 0.5 }}>
                          <strong>City:</strong> {row.city}
                        </Typography>
                      )}

                      {/* ---------------- EMAIL ---------------- */}
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
                        <Typography sx={{ mb: 0.5 }}>
                          <strong>Email:</strong> {row.email}
                        </Typography>
                      )}

                      {/* ---------------- PHONE ---------------- */}
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
                        <Typography sx={{ mb: 1 }}>
                          <strong>Phone:</strong> {row.phone}
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      {/* ---------------- ACTION BUTTONS ---------------- */}
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                      >
                        {isEditing ? (
                          <>
                            {/* SAVE */}
                            <IconButton
                              onClick={handleSave}
                              sx={{
                                background: "#e7f9ef",
                                "&:hover": { background: "#d3f3e0" },
                              }}
                            >
                              <SaveIcon sx={{ color: "green" }} />
                            </IconButton>

                            {/* CANCEL */}
                            <IconButton
                              onClick={handleCancel}
                              sx={{
                                background: "#fdeaea",
                                "&:hover": { background: "#f8dcdc" },
                              }}
                            >
                              <CloseIcon sx={{ color: "red" }} />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            {/* EDIT */}
                            <IconButton
                              onClick={() => handleEdit(row)}
                              sx={{
                                background: "#e7f9ef",
                                "&:hover": { background: "#d3f3e0" },
                              }}
                            >
                              <EditIcon sx={{ color: "green" }} />
                            </IconButton>

                            {/* DELETE */}
                            <IconButton
                              onClick={() => handleDelete(row._id)}
                              sx={{
                                background: "#fdeaea",
                                "&:hover": { background: "#f8dcdc" },
                              }}
                            >
                              <DeleteIcon sx={{ color: "red" }} />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}

          {/* ---------------- DESKTOP TABLE VIEW ---------------- */}
          {!isMobile && !isTablet && (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ background: "#EF7722" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Full Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Country
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      City
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Phone
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
                  {rows.map((row) => (
                    <TableRow key={row._id}>
                      {/* ------------ FULL NAME ------------ */}
                      <TableCell>
                        {editId === row._id ? (
                          <TextField
                            size="small"
                            value={editData.fullname}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                fullName: e.target.value,
                              })
                            }
                          />
                        ) : (
                          row.fullName
                        )}
                      </TableCell>

                      {/* ------------ COUNTRY ------------ */}
                      <TableCell>
                        {editId === row._id ? (
                          <TextField
                            size="small"
                            value={editData.country}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                country: e.target.value,
                              })
                            }
                          />
                        ) : (
                          row.country
                        )}
                      </TableCell>

                      {/* ------------ CITY ------------ */}
                      <TableCell>
                        {editId === row._id ? (
                          <TextField
                            size="small"
                            value={editData.city}
                            onChange={(e) =>
                              setEditData({ ...editData, city: e.target.value })
                            }
                          />
                        ) : (
                          row.city
                        )}
                      </TableCell>

                      {/* ------------ EMAIL ------------ */}
                      <TableCell>
                        {editId === row._id ? (
                          <TextField
                            size="small"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                email: e.target.value,
                              })
                            }
                          />
                        ) : (
                          row.email
                        )}
                      </TableCell>

                      {/* ------------ PHONE ------------ */}
                      <TableCell>
                        {editId === row._id ? (
                          <TextField
                            size="small"
                            value={editData.phone}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                phone: e.target.value,
                              })
                            }
                          />
                        ) : (
                          row.phone
                        )}
                      </TableCell>

                      {/* ------------ ACTIONS ------------ */}
                      <TableCell align="center">
                        {editId === row._id ? (
                          <>
                            <IconButton onClick={handleSave}>
                              <SaveIcon color="success" />
                            </IconButton>
                            <IconButton onClick={handleCancel}>
                              <CloseIcon color="error" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton onClick={() => handleEdit(row)}>
                              <EditIcon color="success" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(row._id)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default Viewers;
