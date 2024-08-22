const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  runningBalance: { type: Number, required: true },
  time: { type: String, required: false },
  senderOrReceiverEmail: { type: String, required: false },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
