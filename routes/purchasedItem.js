const express = require("express");
const router = express.Router();
const PurchasedItem = require("../models/PurchasedItem");

router.get("/purchased-items/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const purchasedItems = await PurchasedItem.find({ userId })
      .populate("userId", "name email")
      .populate("giftItemId", "name description price image");

    res.json(purchasedItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/inventory-details", async (req, res) => {
  try {
    const purchasedItems = await PurchasedItem.aggregate([
      {
        $group: {
          _id: { userId: "$userId", giftItemId: "$giftItemId", date: "$date", currentPrice: "$currentPrice" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "giftitems",
          localField: "_id.giftItemId",
          foreignField: "_id",
          as: "giftItem"
        }
      },
      {
        $unwind: "$giftItem"
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          user: { name: "$user.name", email: "$user.email" },
          giftItem: { name: "$giftItem.name", description: "$giftItem.description", price: "$giftItem.price" },
          count: 1,
          date: "$_id.date",
          currentPrice: "$_id.currentPrice"
        }
      }
    ]);

    res.json(purchasedItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
