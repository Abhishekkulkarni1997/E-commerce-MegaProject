import express from "express";
const productRoutes = express.Router();

import {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
} from "../controllers/product.controller.js";

productRoutes.post("/api/addProduct", addProduct);
productRoutes.get("/api/getAllProducts", getAllProducts);
productRoutes.get("/api/getProductById/:id", getProductById);
productRoutes.delete("/api/deleteProductById/:id", deleteProductById);

export default productRoutes;
