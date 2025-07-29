import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => {
        const productData = res.data.product;
        setProduct(productData);
        setName(productData.name);
        setPreview(productData.image?.url || productData.image || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);

    try {
      await updateProduct(id, formData);
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#000"
      >
        <CircularProgress color="inherit" />
      </Box>
    );

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: 500,
          width: "100%",
          bgcolor: "#000",
          color: "#fff",
          border: "1px solid #333",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          sx={{ color: "#fff", mb: 2 }}
        >
          Edit Product
        </Typography>

        <TextField
          fullWidth
          label="Product Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputLabelProps={{ style: { color: "#bbb" } }}
          InputProps={{
            style: {
              color: "#fff",
              backgroundColor: "#111",
              borderColor: "#444",
            },
          }}
        />

        <Box mt={3} textAlign="center">
          <Typography variant="subtitle2" color="#bbb" gutterBottom>
            Product Image
          </Typography>

          <Avatar
            src={preview}
            variant="rounded"
            sx={{
              width: 140,
              height: 140,
              mx: "auto",
              mb: 1,
              border: `2px solid #333`,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                cursor: "pointer",
              },
            }}
            onClick={() => fileInputRef.current.click()}
          />

          <Input
            type="file"
            inputRef={fileInputRef}
            sx={{ display: "none" }}
            onChange={handleImageChange}
          />

          <Typography
            variant="body2"
            color="#aaa"
            sx={{
              mt: 1,
              cursor: "pointer",
              "&:hover": { color: "#fff" },
            }}
            onClick={() => fileInputRef.current.click()}
          >
            Tap image to update
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          mt={4}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/")}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1e88e5", color: "#fff" }}
            disabled={submitting}
            onClick={handleSubmit}
            fullWidth
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
            fullWidth
          >
            Delete
          </Button>
        </Stack>

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this product?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default ProductDetail;
