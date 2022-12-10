const router = require("express").Router();
const { Product} = require("../models/product");
// const bcrypt = require("bcrypt");
router.get("/:id", async (req, res) => {
	try {
		const product = await Product.findOne({_id:req.params.id})
		res.status(200).send({data:product})
	} catch (error) {
		console.log(error);	
	}
});

router.get("/", async (req, res) => {
	try {
		const product = await Product.find({});
        res.send(product);
        console.log(product);
	} catch (error) {
        console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;
