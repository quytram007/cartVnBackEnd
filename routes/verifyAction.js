const router = require("express").Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const verifyAction = require('../middleware/verifyToken');
const { Cart } = require("../models/cart");
                                                                                                                                                                                                                                                                                                                                                           
 
router.post("/", async (req, res) => {
	try {
        const data = verifyAction(req.body.token)
        const userId = verifyAction(req.body.token)._id;
		const cart = await Cart.findOne({ userId: userId});
        if(cart){
            countProduct = (cart.listProduct).length;
        }
        		res.status(200).send({ message: "Verify successfully" , data: data,countProduct:countProduct});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router,verifyAction;
