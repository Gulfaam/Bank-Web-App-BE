const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isLogin: { type: Boolean, required: false, default: false },
  balance: { type: Number, default: 100 },
  transferBalance: { type: Number, default: 0 },
  isActive: { type: Boolean, required: false, default: false },
  isWithdraw: { type: Boolean, required: false, default: false },
  isDeposit: { type: Boolean, required: false, default: false },
  isTransfer: { type: Boolean, required: false, default: false },
  isSalaryReceived: { type: Boolean, required: false, default: false },
  salary: { type: Number, required: false, default: 0 },
  isMoneyReceived: { type: Boolean, required: false, default: false },
  receivedMoney: { type: Number, required: false, default: 0 },
  message: { type: String, required: false },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

module.exports = mongoose.model("User", UserSchema);
