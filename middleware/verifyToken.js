const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (token) {
    jwt.verify(token, "jwtPrivateKey", (err, user) => {
      if (err) {
        // console.log(err);
        res.status(403).send({ success: false, message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .send({ success: false, message: "you are not authenticated!" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id) {
      next();
    } else {
      res
        .status(403)
        .send({ success: false, message: "You are not allowed to do that!" });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id) {
      next();
    } else {
      res
        .status(403)
        .send({ success: false, message: "You are not allowed to do that!" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
