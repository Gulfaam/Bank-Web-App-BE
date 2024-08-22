const mongoose = require("mongoose");

const GiftItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("GiftItem", GiftItemSchema);
