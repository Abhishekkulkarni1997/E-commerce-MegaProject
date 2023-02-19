import Product from "../Models/product.js";
import Coupon from "../Models/coupon.js";
import Order from "../Models/order.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../utils/customError.js";
import razorpay from "../config/razorpay.config.js";

/**************** 
@GENERATE_RAZORPAY_ID
@route http://localhost:4000/api/order/razorpay
@description controller used fir generating razorpay id 
@description creates a razorpay id whihc is used for plazing order
@returns order object with "razorpay order id generated successfully"

*************************/
// TODO:

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  // get product and coupon from frontend
  //verify product price from backend
  // make db query to get all products and info
  //total amount and final amount
  //coupon check from db
  // discount
  //final amount = total amount - discount
  //razorpay option of gateway from docs
  //if order does not exist
  //success then, send it to front end
});
