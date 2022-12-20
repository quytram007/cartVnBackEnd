const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  photo: { type: Array, required: true },
  sold: { type: String, required: true },
  color: { type: Array, required: true },
  size: { type: Array, required: true },
  sellerId: { type: String, required: true },
  description: { type: String, required: true },
});
const Product = mongoose.model("product", productSchema);
module.exports = { Product };
