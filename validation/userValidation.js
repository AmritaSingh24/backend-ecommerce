const yup = require("yup");

const userSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().max(50).email().required("Email is required"),
  phone: yup.string().min(10).max(10).required("Phone number is required"),
  password: yup.string().min(6).required("password is required"),
});

const loginSchema = yup.object({
  email: yup.string().max(50).email().required("Email is required"),
  password: yup.string().min(6).required("password is required"),
});

module.exports = userSchema;
module.exports = loginSchema;
