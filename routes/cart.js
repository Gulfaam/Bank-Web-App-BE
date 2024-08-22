const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const PurchasedItem = require("../models/PurchasedItem");
const Inventory = require("../models/Inventory");

router.post("/add-to-cart", async (req, res) => {
  const { userId, giftItemId } = req.body;
  try {
    // const alreadyExist = await Cart.findOne({ userId, giftItemId });
    // if (alreadyExist) {
    //   return res.status(409).send("Already Exist");
    // }
    const newCart = new Cart({
      userId,
      giftItemId,
    });
    await newCart.save();
    res.status(201).send(newCart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/cart-items/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const carts = await Cart.find({ userId })
      .populate("userId", "name email")
      .populate("giftItemId", "name description price image");

    const totalPrice = carts.reduce(
      (sum, cart) => sum + cart?.giftItemId?.price,
      0
    );

    res.json({ carts, totalPrice });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/delete-cart/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: id,
    });
    if (!cartItem) {
      return res.status(404).send({ message: "Cart item not found" });
    }
    res.status(200).send({ message: "Item removed from cart successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/buy", async (req, res) => {
  try {
    const { userId } = req.body;
    const carts = await Cart.find({ userId }).populate("giftItemId");
    if (carts?.length) {
      await Promise.all(
        carts.map((cart) => {
          const purchasedItem = new PurchasedItem({
            userId,
            giftItemId: cart.giftItemId._id,
            date: Date.now(),
            currentPrice: cart.giftItemId.price
          });
          return purchasedItem.save();
        })
      );
      await Promise.all(
        carts.map((cart) => {
          return Inventory.findOneAndUpdate({ giftItemId: cart.giftItemId }, {
            $inc: { quantity: -1, numberOfPurchased: 1 },
          })
        })
      );
      await Cart.deleteMany({ userId });
      return res.status(200).send("Successfully Purchased")
    }
  } catch (err) {
    return res.status(500).send("Something wrong, " + err)
  }

});

module.exports = router;
