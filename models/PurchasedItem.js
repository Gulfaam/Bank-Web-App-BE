const mongoose = require("mongoose");

const PurchasedItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  giftItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GiftItem",
    required: true,
  },
  date: { type: Date, required: true },
  currentPrice: { type: Number, required: true }
});

module.exports = mongoose.model("PurchasedItem", PurchasedItemSchema);
