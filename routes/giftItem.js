const express = require("express");
const multer = require("multer");
const router = express.Router();
const GiftItem = require("../models/GiftItem");
const Inventory = require("../models/Inventory");
const PurchasedItem = require("../models/PurchasedItem");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/add-gift", upload.single("image"), async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const alreadyExist = await GiftItem.findOne({ name });
    if (alreadyExist) {
      return res.status(409).send("Item Already Exist");
    }
    const newGift = new GiftItem({
      name,
      description,
      price,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    await newGift.save();
    const inventory = new Inventory({
      giftItemId: newGift._id,
      quantity: 1,
      numberOfPurchased: 0,
    });
    await inventory.save();
    res.status(201).send(newGift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/edit-gift/:id", upload.single("image"), async (req, res) => {
  const { name, description, price } = req.body;
  const { id } = req.params;
  try {
    const updatedData = {
      name,
      description,
      price,
    };

    if (req.file) {
      updatedData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedGift = await GiftItem.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.send(updatedGift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/gift-items", async (req, res) => {
  try {
    const gifts = await GiftItem.aggregate([
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "giftItemId",
          as: "inventory"
        }
      },
      {
        $unwind: {
          path: "$inventory",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
          quantity: "$inventory.quantity"
        }
      }
    ]);

    res.json(gifts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/delete-gift/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await GiftItem.findByIdAndDelete(id);
    await PurchasedItem.deleteMany({ giftItemId: id })
    res.status(200).send({ message: "Gift item deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
