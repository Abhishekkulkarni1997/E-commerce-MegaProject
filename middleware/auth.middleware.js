import User from "../Models/userSchema";
import JWT from "jsonwebtoken";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import config from "../config/index";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  // check for token in cookie and header
  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[0];
    // check the bearer token on websearch
  }

  try {
    const decodedJWTPayload = JWT.verify(token, config.JWT_SECRET);

    // _id, find user based on id and set this in req.user
    req.user = await User.findById(decodedJWTPayload._id, "name email role"); // "name email role" - here we grabbed name email and role from user to limit the api response
    next();
  } catch (error) {
    if (!token) {
      throw new CustomError("Not authorized to access this route", 401);
    }
  }
});
