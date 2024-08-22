const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipt");

router.get("/", async (req, res) => {
  try {
    const receipts = await Receipt.find({})
      .populate("senderId")
      .populate("receiverId");

    const totalSendAmount = receipts.reduce((total, receipt) => total + receipt.amount, 0);

    const totalReceiveAmount = receipts.reduce((total, receipt) => total + receipt.amount, 0);

    res.json({
      receipts,
      totalSendAmount,
      totalReceiveAmount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const receipts = await Receipt.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate("senderId")
      .populate("receiverId");

    const totalSendAmount = receipts
      .filter((receipt) => receipt.senderId._id.toString() === userId)
      .reduce((total, receipt) => total + receipt.amount, 0);

    const totalReceiveAmount = receipts
      .filter((receipt) => receipt.receiverId._id.toString() === userId)
      .reduce((total, receipt) => total + receipt.amount, 0);

    res.json({
      receipts,
      totalSendAmount,
      totalReceiveAmount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
