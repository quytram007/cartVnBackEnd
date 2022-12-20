const router = require("express").Router();
const verifyAction = require("../middleware/verifyToken");
const { Cart } = require("../models/cart");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const userId = verifyAction(req.body.token)._id;
    const cart = await Cart.findOne({ userId: userId });
    const userData = await User.findOne({ _id: userId });
    let product = [];
    if (cart) {
      product = cart.listProduct;
    } else {
      countProduct = 0;
    }
    res.status(200).send({
      message: "Verify successfully",
      data: userData,
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

(module.exports = router), verifyAction;
// (pro)=>{return{...listProduct,cc:productKeyById[pro._id]}}
