import ProductModel from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

// Create a new product
export const createProductController = async (req, res) => {
  try {
    let { name, status } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).send({
        error: true,
        message: "Name is required",
      });
    }

    name = name.trim();

    const validStatuses = ["out_of_stock", "low", "normal", "good"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).send({
        error: true,
        message: "Invalid status value",
      });
    }

    let image = null;

    if (req.file) {
      image = {
        url: req.file.path || req.file.secure_url,
        public_id: req.file.filename || req.file.public_id,
      };
    }

    if (!image || !image.url || !image.public_id) {
      return res.status(400).send({
        error: true,
        message: "Image upload failed",
      });
    }

    const newProduct = new ProductModel({
      name,
      image,
      status: status || "normal",
    });

    await newProduct.save();

    return res.status(201).send({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Edit a product
export const editProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }

    if (name && name.trim() !== "") {
      product.name = name.trim();
    }

    const validStatuses = ["out_of_stock", "low", "normal", "good"];
    if (status) {
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .send({ error: true, message: "Invalid status value" });
      }
      product.status = status;
    }

    if (req.file) {
      if (product.image && product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      product.image = {
        url: req.file.path || req.file.secure_url,
        public_id: req.file.filename || req.file.public_id,
      };
    }

    await product.save();

    return res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Change only product status
export const changeProductStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["out_of_stock", "low", "normal", "good"];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({
        error: true,
        message: "Invalid status value",
      });
    }

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).send({
        error: true,
        message: "Product not found",
      });
    }

    product.status = status;
    await product.save();

    return res.status(200).send({
      success: true,
      message: "Status updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error changing product status:", error);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Delete a product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }

    if (product.image && product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await product.deleteOne();

    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Get all products
export const getAllProductsController = async (req, res) => {
  try {
    const { search, status } = req.query;

    const query = {};

    if (search && search.trim() !== "") {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    const validStatuses = ["out_of_stock", "low", "normal", "good"];
    if (status && validStatuses.includes(status)) {
      query.status = status;
    }

    const products = await ProductModel.find(query).sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Get product by ID
export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .send({ error: true, message: "Product not found" });
    }

    return res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};
