const error = async (req, res, next) => {
  console.log("Something went wrong..");
  next();
};

module.exports = error;
