import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Stack,
  Input,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { createProduct } from "../services/productService"; // adjust this import

const CreateProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name || !imageFile) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile);

    try {
      await createProduct(formData);
      navigate("/");
    } finally {
      setSubmitting(false);
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
          Create New Product
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

        <Box
          mt={3}
          sx={{
            border: "2px dashed #555",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: "#111",
            "&:hover": {
              borderColor: "#888",
            },
          }}
          onClick={() => fileInputRef.current.click()}
        >
          {preview ? (
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: "100%",
                height: 200,
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          ) : (
            <>
              <Typography variant="body2" color="#aaa" sx={{ mb: 1 }}>
                Click to upload product image
              </Typography>
              <Typography variant="caption" color="#666">
                Supported formats: JPG, PNG | Max size: 5MB
              </Typography>
            </>
          )}

          <Input
            type="file"
            inputRef={fileInputRef}
            sx={{ display: "none" }}
            onChange={handleImageChange}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1e88e5", color: "#fff" }}
            disabled={submitting || !name || !imageFile}
            onClick={handleSubmit}
          >
            {submitting ? "Creating..." : "Create"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateProduct;
