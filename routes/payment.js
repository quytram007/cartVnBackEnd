const router = require("express").Router();
const { User } = require("../models/user");
const { History } = require("../models/history");
const verifyAction = require("../middleware/verifyToken");
const axios = require("axios");
router.post("/", async (req, res) => {
  try {
    const userId = verifyAction(req.body.token);
    const user = await User.findOne({ _id: userId });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/changeaddress", async (req, res) => {
  try {
    const userId = verifyAction(req.body.token);
    const addressUserBuy = (await User.findOne({ _id: userId })).address;
    let product = req.body.product;
    console.log(product);
    let _product = [];
    for (let i = 0; i < product.length; i++) {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${product[i].addressSeller}&destinations=${req.body.newAddress}&units=imperial&key=${process.env.API_KEY_DISTANCE}`;
      const _distance = await axios.get(url);
      const distance = JSON.parse(JSON.stringify(_distance.data));
      shipfee =
        Number(distance.rows[0].elements[0].distance.text.replace("mi", "")) *
        1.6 *
        50;
      _product.push({ ...product[i], deliveryCost: shipfee });
    }
    console.log(_product);

    res.status(200).send({ _product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
module.exports = router;
