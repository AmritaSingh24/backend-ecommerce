const express = require("express");
const router = express.Router();
const { Cart } = require("../models/cart");
const asyncMiddleware = require("../middleware/async");

// create
router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const newCart = new Cart(req.body);

    const savedCart = await newCart.save();
    res.status(200).send({ success: true, savedCart });
  })
);

// Update
router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).send({ success: true, updateCart });
  })
);

// Delete
router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const deleteCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deleteCart)
      return res
        .status(400)
        .send({ success: false, message: "Cart not found" });
    res
      .status(200)
      .send({ success: true, message: "Product has been deleted...." });
  })
);

// Get single Cart
router.get(
  "/find/:id",
  asyncMiddleware(async (req, res) => {
    const cart = await Cart.findById(req.params.id);
    res.status(200).send({ success: true, cart });
  })
);

// Get User Cart
router.get(
  "/find/userId/:userId",
  asyncMiddleware(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).send({ success: true, cart });
  })
);

// Get All
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const cartSort = req.query.sort;
    const cartLimit = req.query.limit;

    let carts;
    if (cartSort) {
      carts = await Cart.find().sort(cartSort);
    } else if (cartLimit) {
      carts = await Cart.find().limit(cartLimit);
    } else {
      carts = await Cart.find();
    }
    res.status(200).send({ success: true, carts });
  })
);

module.exports = router;
