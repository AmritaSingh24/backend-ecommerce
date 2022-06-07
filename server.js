const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const error = require("./middleware/error");
let bodyParser = require("body-parser");

mongoose
  .connect("mongodb://localhost/ecommerce")
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log("Could not connect to mongoDB...", err));

// app.use(bodyParser.json());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use(error);

app.listen(5000, () => {
  console.log("backend server is running");
});
