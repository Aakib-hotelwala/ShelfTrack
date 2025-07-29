import express from "express";
import {
  changeProductStatusController,
  createProductController,
  deleteProductController,
  editProductController,
  getAllProductsController,
  getProductByIdController,
} from "../controllers/product.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);
router.patch("/:id/status", changeProductStatusController);
router.post("/", upload.single("image"), createProductController);
router.put("/:id", upload.single("image"), editProductController);
router.delete("/:id", deleteProductController);

export default router;
