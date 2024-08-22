const express = require("express");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Receipt = require("../models/Receipt");
const router = express.Router();

router.put("/update-balance", async (req, res) => {
  const { amount, type, userId, time, receiverEmail, isSalary, isBuy, message } =
    req.body;

  try {
    const user = await User.findById(userId);
    let receiver;
    if (type === "deposit") {
      user.balance += amount;
      if (!isSalary && message) {
        const receipt = await Receipt.find({ receiverId: user.id });
        if (receipt?.length > 0) {
          receipt[receipt.length - 1].receiverMessage = message
          receipt[receipt.length - 1].receiverTimeStamp = time
          user.message = ""
          user.isMoneyReceived = false
          user.receivedMoney = 0
          await receipt[receipt.length - 1].save()
        }
      }
    } else if (type === "send") {
      receiver = await User.findOne({ email: receiverEmail });
      if (!receiver) {
        return res.status(404).send("Receiver not found");
      }
      if (receiver.id === user.id) {
        return res.status(403).send("Both Sender and receiver are same");
      }
      receiver.transferBalance += amount;
      receiver.isMoneyReceived = true;
      receiver.receivedMoney = amount;
      receiver.message = message;

      user.balance -= amount;
      const receiverTransaction = new Transaction({
        userId: receiver.id,
        type: "receive",
        amount,
        runningBalance: receiver.balance + receiver.transferBalance,
        time,
        senderOrReceiverEmail: user?.email,
      });
      await receiverTransaction.save();
      receiver.transactions.push(receiverTransaction.id);
      await receiver.save();
      const receipt = new Receipt({
        senderId: user.id,
        receiverId: receiver.id,
        amount,
        senderMessage: message,
        senderTimeStamp: time
      })
      await receipt.save()
    } else if (isBuy === "true") {
      user.transferBalance -= amount;
    } else if (user.balance < amount) {
      user.balance = user.balance - amount;
      user.transferBalance += user.balance;
      user.balance = 0;
    } else {
      user.balance -= amount;
    }

    const transaction = new Transaction({
      userId: user.id,
      type,
      amount,
      runningBalance: user.balance + user.transferBalance,
      time,
      senderOrReceiverEmail: receiver?.email,
    });

    await transaction.save();
    user.transactions.push(transaction.id);
    if (isSalary) {
      user.isSalaryReceived = false;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const users = await User.find().populate("transactions");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send("User not found");
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { field } = req.body;
  const user = await User.findById(id);
  if (user) {
    if (field === "isActive") {
      user.isActive = !user.isActive;
    }
    if (field === "isWithdraw") {
      user.isWithdraw = !user.isWithdraw;
    }
    if (field === "isDeposit") {
      user.isDeposit = !user.isDeposit;
    }
    if (field === "isTransfer") {
      user.isTransfer = !user.isTransfer;
    }
    await user.save();
    res.status(200).send(user);
  } else {
    res.status(404).send("User not found");
  }
});

router.put("/process-salary/:id", async (req, res) => {
  const { id } = req.params;
  const { salary } = req.body;
  const user = await User.findById(id);
  if (user) {
    user.isSalaryReceived = true;
    user.salary = salary;
    await user.save();
    res.status(200).send(user);
  } else {
    res.status(404).send("User not found");
  }
});
module.exports = router;
