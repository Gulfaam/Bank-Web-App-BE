const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    senderMessage: { type: String, required: false },
    receiverMessage: { type: String, required: false },
    senderTimeStamp: { type: String, required: false },
    receiverTimeStamp: { type: String, required: false },
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
