import {
  Box,
  TextField,
  Avatar,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, changeProductStatus } from "../services/productService";

const STATUSES = ["out_of_stock", "low", "normal", "good"];
const STATUS_LABELS = {
  out_of_stock: "Out of Stock",
  low: "Low",
  normal: "Normal",
  good: "Good",
};
const STATUS_COLORS = {
  out_of_stock: "error",
  low: "warning",
  normal: "info",
  good: "success",
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadProducts = async () => {
    const res = await fetchProducts({
      search: search || undefined,
      status: statusFilter || undefined,
    });
    setProducts(res.data.products);
  };

  useEffect(() => {
    loadProducts();
  }, [search, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    await changeProductStatus(id, newStatus);
    loadProducts();
  };

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 4, md: 8 },
        py: { xs: 1, sm: 3 },
        maxWidth: "100%",
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 700, color: "primary.main" }}
      >
        Inventory Status
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { sm: "center" },
          mb: 2,
        }}
      >
        <TextField
          label="Search product..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            bgcolor: "#2c2c2c",
            borderRadius: 1,
            flexGrow: 1,
          }}
        />

        <Autocomplete
          options={STATUSES}
          getOptionLabel={(option) => STATUS_LABELS[option]}
          value={statusFilter || null}
          onChange={(event, newValue) => setStatusFilter(newValue || "")}
          clearOnEscape
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by status"
              sx={{
                bgcolor: "#2c2c2c",
                borderRadius: 1,
                width: { xs: "100%", sm: "200px" },
              }}
            />
          )}
          clearIcon={
            <span style={{ cursor: "pointer", color: "#fff" }}>×</span>
          }
          disableClearable={false}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/product/create")}
          sx={{
            whiteSpace: "nowrap",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            color: "#fff",
          }}
        >
          + Add Product
        </Button>
      </Box>

      <Box sx={{ overflowX: isMobile ? "visible" : "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "#1e1e1e",
            boxShadow: "none",
            overflowX: "unset",
          }}
        >
          <Table>
            {!isMobile && (
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: "#fff" }}>
                    Image
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#fff" }}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#fff" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {products.map((product) =>
                isMobile ? (
                  <TableRow
                    key={product._id}
                    hover
                    onMouseDown={(e) => {
                      e.currentTarget.pressTimer = setTimeout(() => {
                        navigate(`/product/${product._id}`);
                      }, 600);
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.pressTimer = setTimeout(() => {
                        navigate(`/product/${product._id}`);
                      }, 600);
                    }}
                    onMouseUp={(e) => clearTimeout(e.currentTarget.pressTimer)}
                    onTouchEnd={(e) => clearTimeout(e.currentTarget.pressTimer)}
                    onMouseLeave={(e) =>
                      clearTimeout(e.currentTarget.pressTimer)
                    }
                    sx={{
                      cursor: "default",
                      "&:hover": {
                        backgroundColor: "#2a2a2a",
                      },
                    }}
                  >
                    <TableCell colSpan={3} sx={{ p: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {/* Row 1: Avatar + Name */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            variant="rounded"
                            src={product.image?.url || product.image}
                            alt={product.name}
                            sx={{ width: 56, height: 56, flexShrink: 0 }}
                          />
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.name}
                          </Typography>
                        </Box>

                        {/* Row 2: Status buttons below */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STATUSES.map((status) => (
                            <Button
                              key={status}
                              onClick={() =>
                                handleStatusChange(product._id, status)
                              }
                              color={
                                product.status === status
                                  ? STATUS_COLORS[status]
                                  : "inherit"
                              }
                              variant={
                                product.status === status
                                  ? "contained"
                                  : "outlined"
                              }
                              size="small"
                              sx={{
                                textTransform: "none",
                                fontSize: "0.7rem",
                                px: 1,
                                whiteSpace: "nowrap",
                                color:
                                  product.status === status
                                    ? "#fff"
                                    : undefined,
                              }}
                            >
                              {STATUS_LABELS[status]}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow
                    key={product._id}
                    hover
                    onClick={() => navigate(`/product/${product._id}`)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#2a2a2a",
                      },
                    }}
                  >
                    <TableCell align="center">
                      <Avatar
                        variant="rounded"
                        src={product.image?.url || product.image}
                        alt={product.name}
                        sx={{ width: 56, height: 56, mx: "auto" }} // mx: auto to center Avatar
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: "#fff",
                          fontWeight: 500,
                          textAlign: "center",
                        }}
                      >
                        {product.name}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                          overflowX: "auto",
                          gap: 1,
                          py: 0.5,
                          justifyContent: "center", // center buttons
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUSES.map((status) => (
                          <Button
                            key={status}
                            onClick={() =>
                              handleStatusChange(product._id, status)
                            }
                            color={
                              product.status === status
                                ? STATUS_COLORS[status]
                                : "inherit"
                            }
                            variant={
                              product.status === status
                                ? "contained"
                                : "outlined"
                            }
                            size="small"
                            sx={{
                              textTransform: "none",
                              fontSize: {
                                xs: "0.7rem",
                                sm: "0.85rem",
                                md: "0.95rem",
                              },
                              px: { xs: 1, sm: 2 },
                              py: { xs: 0.3, sm: 0.6 },
                              whiteSpace: "nowrap",
                              color:
                                product.status === status ? "#fff" : undefined,
                              minWidth: { xs: "auto", sm: 80 },
                            }}
                          >
                            {STATUS_LABELS[status]}
                          </Button>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Home;
