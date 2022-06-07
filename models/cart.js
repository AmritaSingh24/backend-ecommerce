const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  cartId: {
    type: String,
    default: `CID${Date.now()}`,
  },
  userId: { type: String, required: true },
  date: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);

exports.Cart = Cart;
