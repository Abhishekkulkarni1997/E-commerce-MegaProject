import User from "../Models/userSchema.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import mailHelper from "../utils/mailhelper.js";
import crypto from "crypto";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/**************** 
@signup
@route http://localhost:4000/api/auth/signup
@description User signup controller for creating a new user
@params name, email , password
@returns User object

*************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new customError("Please fill all the fields", 400);
  }

  //check if user exists

  const extUser = await User.findOne({ email });

  if (extUser) {
    throw new customError("user already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJWTtoken();
  console.log(user);
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

/**************** 
@login
@route http://localhost:4000/api/auth/login
@description User login controller
@params  email , password
@returns User object

*************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError("Both fields are required", 400);
  }

  const user = await User.find({ email }).select("+password");

  if (!user) {
    throw new customError("Incorrect username or password", 400);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (isPasswordMatched) {
    const token = user.getJWTtoken;
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }
  throw new customError("Incorrect username or password", 400);
});

/**************** 
@logout
@route http://localhost:4000/api/auth/logout
@description User logout controller by clearing cookies
@params  
@returns User object

*************************/

export const logout = asyncHandler(async (req, res) => {
  // res.clearCookie()
  // also check nodemailer npm package or mailinator
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

/**************** 
@Forgot_Password
@route http://localhost:4000/api/auth/password/forgot
@description User will submit email and we will send code
@params  email
@returns Success message - email sent

*************************/

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // check email empty string
  if (!user) {
    throw new customError("user not found", 404);
  }
  const resetToken = user.generateForgotPasswordToken();

  await user.save({
    validateBeforeSave: false,
  }); /* validateBeforeSave: false  skips the validatation part before saving */

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/password/reset/${resetToken}`;

  const text = `Your password reset link is 
  \n \n  ${resetUrl} \n\n`;

  try {
    await mailHelper({
      email: user.email,
      subject: "Password reset email for website",
      text: text,
    });
    res.status().json({
      success: true,
      message: `email sent to ${user.email}`,
    });
  } catch (error) {
    //rollback changes
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    throw new customError(err.message || "Failed to send the email", 500);
  }
});

/**************** 
@Forgot_Password
@route http://localhost:4000/api/auth/password/reset/:resetPasswordToken
@description User will be able to reset password based on url token
@params  token from url, password and confirm password
@returns user object

*************************/

export const resetPassword = asyncHandler(async () => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gr: Date.now() },
  }); /* we are checking for a user with given token and the timeout expiry */

  if (!user) {
    throw customError("Invalid password token", 400);
  }
  if (password !== confirmPassword) {
    throw customError("Password does not match", 400);
  }
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  // create a token and send as response

  const token = user.getJWTtoken();
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    user,
  });
});

/**************** 
@Get_UserProfile
@requestType GET
@route http://localhost:4000/api/auth/profile
@description Check for token and populate req.user
@params  
@returns user object

*************************/

export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user; // getting user from req.user auth.middleware
  if (!user) {
    throw new customError("user not found", 404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// TODO: create a controller for change password

/**************** 
@Get_UserProfile
@requestType GET
@route http://localhost:4000/api/auth/profile/changePassword/:id
@description Change password
@params  
@returns user object

*************************/

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw customError("Password does not match", 400);
  }

  const user = await User.findByIdAndUpdate(id, { password: password });

  res.status(200).json({
    success: true,
    message: "password changed",
  });
});
