const router = require("express").Router();
const { Product } = require("../models/product");
const verifyAction = require("../middleware/verifyToken");
const cloudinary = require("../utitils/cloudinary");
const { includes } = require("lodash");
// const bcrypt = require("bcrypt");
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    res.status(200).send({ data: product });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const product = await Product.find({});
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/search", async (req, res) => {
  try {
    const search = req.body.search;
    const product = await Product.find({
      name_lower: { $regex: search.toLowerCase() },
    });
    console.log(product);
    res.status(200).send({ message: "sucess", product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/myproduct", async (req, res) => {
  try {
    userId = verifyAction(req.body.token);
    const product = await Product.find({ sellerId: userId });
    console.log(product);
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/addproduct", async (req, res) => {
  try {
    // console.log(req.body.addProduct);
    const userId = verifyAction(req.body.token);
    const _photo = req.body.addProduct.photo;
    let photo = [];
    Promise.all(
      _photo.map(async (value) => {
        result = await cloudinary.uploader.upload(value, {
          folder: `${userId}/product`,
        });
        photo = [
          ...photo,
          { image: result.secure_url, public_id: result.public_id },
        ];
        console.log(photo);
      })
    ).then(async () => {
      await new Product({
        ...req.body.addProduct,
        sold: 0,
        photo: photo,
        sellerId: userId,
      }).save();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
