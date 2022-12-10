const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	listProduct: { type: Array, required: true },
    
});
const Cart = mongoose.model("cart", cartSchema);
module.exports = { Cart};




