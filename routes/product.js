const { Product } = require("../models/product");
const multer = require("multer");
const express = require("express");
const validation = require("../middleware/validationMiddleware");
const productSchema = require("../validation/validation");
const asyncMiddleware = require("../middleware/async");
const router = express.Router();

// image store
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
});

// Create
router.post(
  "/",
  upload.single("img"),
  validation(productSchema),
  asyncMiddleware(async (req, res) => {
    let newProduct = await Product.findOne({ title: req.body.title });
    if (newProduct)
      return res
        .status(400)
        .send({ success: false, error: "This product already stored" });

    newProduct = new Product({
      title: req.body.title,
      desc: req.body.desc,
      img: req.file.filename,
      category: req.body.category,
      price: req.body.price,
    });
    const savedProduct = await newProduct.save();
    res.status(200).send({ success: true, savedProduct });
  })
);

// Update
router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).send({ success: true, updateProduct });
  })
);

// Delete
router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct)
      return res
        .status(400)
        .send({ success: false, message: "Product not found" });
    res
      .status(200)
      .send({ success: true, message: "Product has been deleted...." });
  })
);

// Get Product
router.get(
  "/find/:id",
  asyncMiddleware(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.status(200).send({ success: true, product });
  })
);

// Get all products
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const productSort = req.query.sort;
    const fetchCategory = req.query.category;
    const productLimit = req.query.limit;

    let products;
    // Product sort
    if (productSort) {
      products = await Product.find().sort(productSort);
    }
    // product limit
    else if (productLimit) {
      products = await Product.find().limit(productLimit);
    }
    // Product category
    else if (fetchCategory) {
      products = await Product.find({
        category: {
          $in: [fetchCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).send({ success: true, products });
  })
);

module.exports = router;
