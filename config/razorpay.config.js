import Razorpay from "razorpay";
import config from "./index.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  ket_secret: RAZORPAY_SECRET,
});
