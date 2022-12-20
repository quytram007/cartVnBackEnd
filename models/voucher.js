const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
    _id:{type:String,required:true},
	discount: { type: Number, required: true },
	quantity: { type: Number, required: true },
    
});
const Voucher = mongoose.model("voucher", voucherSchema);
module.exports = { Voucher};




