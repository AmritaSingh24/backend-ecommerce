const yup = require("yup");

const productSchema = yup.object({
  title: yup.string().required("title is required"),
  desc: yup.string().required("description is required"),
  // img: yup.string().required("image is required"),
  category: yup.string().required("category is required"),
  price: yup.string().required("price is required"),
});

module.exports = productSchema;
