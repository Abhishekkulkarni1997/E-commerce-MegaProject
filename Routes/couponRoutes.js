import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const couponRoutes = express.Router();

import {
  createCoupon,
  deactivateCoupon,
  deleteCoupon,
  getCoupons,
} from "../controllers/coupons.controller.js";

couponRoutes.post("/api/createCoupon", isLoggedIn, createCoupon);

couponRoutes.patch(
  "/api/deactivateCoupon/:couponID",
  isLoggedIn,
  deactivateCoupon
);

couponRoutes.delete("/api/deleteCoupon/:couponID", isLoggedIn, deleteCoupon);

couponRoutes.get("/api/getCoupons", isLoggedIn, getCoupons);

export default couponRoutes;
