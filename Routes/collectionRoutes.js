import express from "express";
const collectionRoutes = express.Router();

import {
  createCollection,
  updateCollection,
  deleteCollection,
  getAllCollections,
} from "../controllers/collection.controller.js";

collectionRoutes.post("/api/createCollection", createCollection);
collectionRoutes.patch("/api/updateCollection/:id", updateCollection);
collectionRoutes.delete("/api/deleteCollection/:id", deleteCollection);
collectionRoutes.get("/api/showCollections", getAllCollections);

export default collectionRoutes;
