import User from "../Models/userSchema";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/**************** 
@signup
@route http://localhost:400/api/auth/signup
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
