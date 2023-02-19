import express from "express";
const authRoutes = express.Router();
import {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  changePassword,
} from "../controllers/authcontroller.js";

authRoutes.post("/api/auth/signup", signUp);
authRoutes.post("/api/auth/login", login);
authRoutes.delete("/api/auth/logout", logout);
authRoutes.post("/api/auth/password/forgot", forgotPassword);
authRoutes.patch("/api/auth/password/reset/:resetPasswordToken", resetPassword);

authRoutes.get("/api/auth/profile", getProfile);
authRoutes.patch("/api/auth/profile/changePassword/:id", changePassword);

export default authRoutes;
