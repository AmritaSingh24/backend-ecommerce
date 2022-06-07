module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: err });
    }
  };
};
