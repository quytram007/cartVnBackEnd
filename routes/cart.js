const router = require("express").Router();
const { Cart } = require("../models/cart");
const bcrypt = require("bcrypt");
const verifyAction = require("../middleware/verifyToken");
const { Product } = require("../models/product");
const { Voucher } = require("../models/voucher");
const { User } = require("../models/user");
const axios = require("axios");

router.post("/addtocart", async (req, res) => {
  try {
    let shipfee = 0;
    const userId = verifyAction(req.body.token)._id;

    const addressUserBuy = (await User.findOne({ _id: userId })).address;
    const addressSeller = (
      await User.findOne({
        _id: req.body.dataBuy.sellerId,
      })
    ).address;
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${addressUserBuy}&destinations=${addressSeller}&units=imperial&key=${process.env.API_KEY_DISTANCE}`;
      const _distance = await axios.get(url);
      const distance = JSON.parse(JSON.stringify(_distance.data));
      shipfee =
        Number(distance.rows[0].elements[0].distance.text.replace("mi", "")) *
        1.6 *
        50;
    } catch (error) {
      console.log(error);
    }
    const cart = await Cart.findOne({ userId: userId });
    console.log(cart);
    if (cart) {
      cart.listProduct.push({
        ...req.body.dataBuy,
        deliveryCost: shipfee,
        addressSeller: addressSeller,
      });
      cart.save();
    } else {
      await new Cart({
        userId: userId,
        listProduct: [
          {
            ...req.body.dataBuy,
            deliveryCost: shipfee,
            addressSeller: addressSeller,
          },
        ],
      }).save();
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
    const cart = await Cart.findOne({ userId: userId });

    if (cart) {
      const productMapped = cart.listProduct.map((product) => {
        return {
          ...product,
          productTotal: product.productPrice * product.quantity,
        };
      });
      console.log(productMapped);
      res.status(200).send({ data: productMapped });
    }
  } catch (error) {}
});
router.post("/voucher", async (req, res) => {
  try {
    const voucher = await Voucher.find({});
    if (voucher) {
      res.status(200).send({ data: voucher });
    }
  } catch (error) {}
});

// router.get("/distance", async (req, res) => {
//   try {
//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=01 Hoàng Thiều Hoa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng&destinations=141%2C%20%TrinhDinhTrong%2C%20TanPhu%2C%20HoChIMinh&units=imperial&key=${process.env.API_KEY_DISTANCE}`;
//     const distance = await axios.get(url);
//     res.status(200).send(JSON.stringify(distance.data));
//   } catch (error) {
//     console.log(error);
//   }
// });
module.exports = router;
