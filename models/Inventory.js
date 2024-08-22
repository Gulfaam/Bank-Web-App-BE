const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  giftItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GiftItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  numberOfPurchased: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Inventory", InventorySchema);
