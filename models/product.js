const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  img: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);

exports.Product = Product;
