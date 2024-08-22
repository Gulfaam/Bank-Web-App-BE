const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

router.get("/", async (req, res) => {
  try {
    const inventory = await Inventory.find().populate(
      "giftItemId",
      "name description price image"
    );

    res.json({ inventory });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/add-more", async (req, res) => {
  try {
    const { giftItemId, quantity } = req.body;
    const inventory = await Inventory.findOne({ giftItemId });
    inventory.quantity += +quantity
    await inventory.save()
    res.status(200).send(inventory)
  } catch (err) {
    return res.status(500).send(err)
  }
});

module.exports = router;
