const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    if (email === "admin@gmail.com") {
      user.isActive = true;
      user.isDeposit = true;
      user.isWithdraw = true;
      user.isTransfer = true;
    }

    const newUser = await user.save();
    res.send(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(400).json({ message: "Account Inactive" });
    }
    const users = await User.find();
    if (users && users.length) {
      for (let u of users) {
        if (u._id.equals(user._id)) {
          u.isLogin = true;
        } else {
          u.isLogin = false;
        }
        await u.save();
      }
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/logout/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    user.isLogin = false;
    await user.save();
    res.json("User Logged Out");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
