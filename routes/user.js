const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const validation = require("../middleware/validationMiddleware");
const userSchema = require("../validation/userValidation");
const loginSchema = require("../validation/userValidation");

// resgister
router.post(
  "/register",
  validation(userSchema),
  asyncMiddleware(async (req, res) => {
    let newUser = await User.findOne({ email: req.body.email });
    if (newUser)
      return res
        .status(400)
        .send({
          success: false,
          error: "User with this email already registered",
        });

    newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const saveUser = await newUser.save();
    const token = newUser.generateAuthToken();
    res
      .status(200)
      .header("x-auth-token", token)
      .send({ success: true, saveUser });
  })
);

// Login

router.post(
  "/login",
  validation(loginSchema),
  asyncMiddleware(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password." });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password." });

    const { password, ...others } = user._doc;

    const token = user.generateAuthToken();
    res
      .status(200)
      .header("x-auth-token", token)
      .send({ success: true, ...others, token });
  })
);

// Update
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncMiddleware(async (req, res) => {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(newUser.password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).send({ success: true, updateUser });
  })
);

// Delete

router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  asyncMiddleware(async (req, res) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser)
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    res.status(200).send({ success: true, message: "User has been deleted" });
  })
);

// Get user

router.get(
  "/:id",
  verifyTokenAndAdmin,
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).send({ success: true, others });
  })
);

// Get all user

router.get(
  "/",
  verifyTokenAndAdmin,
  asyncMiddleware(async (req, res) => {
    const userSort = req.query.sort;
    const userLimit = req.query.limit;
    let users;
    if (userSort) {
      users = await User.find().sort(userSort);
    } else if (userLimit) {
      users = await User.find().limit(userLimit);
    } else {
      users = await User.find();
    }
    res.status(200).send({ success: true, users });
  })
);

module.exports = router;
