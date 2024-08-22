const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  giftItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GiftItem",
    required: true,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
