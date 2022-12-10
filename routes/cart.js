const router = require("express").Router();
const { Cart } = require("../models/cart");
const bcrypt = require("bcrypt");
const verifyAction = require('../middleware/verifyToken')


router.post("/", async (req, res) => {
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

module.exports = router;
