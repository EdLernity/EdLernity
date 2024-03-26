import mongoose from "mongoose";

const Coupon = mongoose.Schema({
couponname: { type: String, required: true},
coupoCode: { type: String, required: true},
usedCount:{ type: Number, default: 0 },
discountValue: { type: Number, default: 0 },
isExpired: { type: Boolean, required: true}
});

export default mongoose.model("Coupon", Coupon);
