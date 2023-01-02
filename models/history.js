const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  listProduct: { type: Array, required: true },
  total: { type: String, required: true },
});
const History = mongoose.model("history", historySchema);
module.exports = { History };
