import mongoose from "mongoose";

import AuthRoles from "../utils/authroles";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import config from "../config";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50 Characters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be atleast 6 Characters"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

//to encrypt the password with mongoose hook

userSchema.pre("save", async function (next) {
  if (!this.isModified(password)) return next();
  this.password = await bcrypt(this.password, 10);
  next();
});

// adding more features to th schema

userSchema.methods = {
  // compare passwords
  comparePassword: async function (enteredPassword) {
    return await bcrypt(enteredPassword, this.password);
  },

  // generate JWT token
  getJWTtoken: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRY,
      }
    );
  },

  // generate forgotPasswordToken
  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");

    //save to db by encryting the forgotToken
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    // return to user
    return forgotToken;
  },
};

export default mongoose.model("User", userSchema);
