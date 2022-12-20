const router = require("express").Router();
const { Cart } = require("../models/cart");
const bcrypt = require("bcrypt");
const verifyAction = require('../middleware/verifyToken');
const { Product } = require("../models/product");
const {Voucher} = require('../models/voucher');


router.post("/addtocart", async (req, res) => {
	try {
        const userId = verifyAction(req.body.token)._id;
        console.log(userId);

		const cart = await Cart.findOne({ userId: userId});
		if (cart){
            cart.listProduct.push(req.body.dataBuy);
            cart.save();
        }
		else{
            await new Cart({ userId:userId, listProduct:[req.body.dataBuy]}).save();
            res.status(201).send({ message: "Cart created successfully" });
        }	
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
        console.log(error);
	}
});
router.post("/", async (req, res) => {
    try {
        const userId = verifyAction(req.body.token)._id;
        const cart = await Cart.findOne({ userId: userId});
        if (cart){
            const productMapped =  cart.listProduct.map((product)=> {return {...product,productTotal: product.productPrice * product.quantity}})
            console.log(productMapped);
            res.status(200).send({data:productMapped})
            
        }

    } catch (error) {
        
    }
});
router.post("/voucher", async (req, res) => {
    try {
        const voucher = await Voucher.find({});
        if (voucher){
            res.status(200).send({data:voucher})     
        }

    } catch (error) {
        
    }
});
module.exports = router;
