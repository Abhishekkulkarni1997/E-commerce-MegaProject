import Coupon from "../Models/coupon.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";

/**************** 
@createCoupon
@route http://localhost:4000/api/createCoupon
@description controller used for creating a coupon & only admin and moderator can create a coupon
@params 
@returns coupon object

*************************/

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, active } = req.body;
  const { user } = req.user;
  const extCoupon = await Coupon.findOne({ code });

  if (user.role === "USER") {
    throw new customError("Not authorized to access this route", 401);
  }

  if (extCoupon) {
    throw new customError("This Coupon Code already exists", 400);
  }

  const coupon = await Coupon.create({
    code,
    discount,
    code,
  });

  res.status(200).json({
    success: true,
    message: "Coupon is created",
    coupon,
  });
});

/**************** 
@deactivateCoupon
@route http://localhost:4000/api/deactivate/:couponID
@description controller used for deactivate a coupon & only admin and moderator can deactivate a coupon
@params 
@returns coupon object

*************************/

export const deactivateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req.user;
  const extCoupon = await Coupon.findOne({ id });

  if (user.role === "USER") {
    throw new customError("Not authorized to access this route", 401);
  }

  if (!extCoupon) {
    throw new customError("This Coupon Code does not exist", 400);
  }

  const coupon = await Coupon.findByIdAndUpdate({ id }, { active: false });

  res.status(200).json({
    success: true,
    message: "Coupon is deactivated",
    coupon,
  });
});

/**************** 
@deleteCoupon
@route http://localhost:4000/api/coupon/:couponID
@description controller used for deleting a coupon & only admin and moderator can delete a coupon
@params 
@returns coupon object

*************************/

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req.user;
  const extCoupon = await Coupon.findOne({ id });

  if (user.role === "USER") {
    throw new customError("Not authorized to access this route", 401);
  }

  if (!extCoupon) {
    throw new customError("This Coupon Code does not exist", 400);
  }

  const coupon = await Coupon.findByIdAndDelete({ id });

  res.status(200).json({
    success: true,
    message: "Coupon is deleted",
    coupon,
  });
});

/**************** 
@getCoupons
@route http://localhost:4000/api/coupon
@description controller used for getting a coupon & only admin and moderator can get a coupon
@params 
@returns coupon object

*************************/

export const getCoupons = asyncHandler(async (req, res) => {
  const { user } = req.user;

  if (user.role === "USER") {
    throw new customError("Not authorized to access this route", 401);
  }
  const coupons = await Coupon.find();

  if (!coupons) {
    throw new customError("Coupon Codes do not exist", 400);
  }

  res.status(200).json({
    success: true,
    message: "All Coupons",
    coupons,
  });
});
