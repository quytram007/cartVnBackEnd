const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("../utitils/cloudinary");
const verifyAction = require("../middleware/verifyToken");
const { image } = require("../utitils/cloudinary");
const axios = require("axios");

let correctCode = "";
router.post("/", async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });
    if (req.body.password !== req.body.rePassword)
      return res.status(409).send({ message: "Password not same" });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    if (req.body.code) {
      console.log(correctCode);
      if (correctCode === req.body.code) {
        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "User created successfully" });
      } else {
        res.status(401).send({ message: "Mã xác thực k chính xác" });
      }
    } else {
      correctCode = Math.floor(Math.random() * 1000000).toString();
      console.log(correctCode);
      const accountSid = process.env.ACOUNT_SID;
      const authToken = process.env.AUTH_TOKEN;
      const client = require("twilio")(accountSid, authToken);
      client.messages.create({
        body: `Hello Nhã Ca, Mình là CartVN, Mã Xác Thực Của Bạn là ${correctCode}`,
        from: "+19295564328",
        to: "+84335551118",
      });
      res.status(201).send({ message: "Nhap Ma Xac Thuc" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/update", async (req, res) => {
  try {
    const userId = verifyAction(req.body.token)._id;
    console.log(userId);
    const data = req.body.userProfile;
    const checkAvatarUser = await User.findOne({ _id: userId });

    let result = {};
    if (checkAvatarUser.avatar) {
      result = await cloudinary.uploader.upload(data.avatar, {
        public_id: checkAvatarUser.avatar.public_id,
      });
    } else
      result = await cloudinary.uploader.upload(data.avatar, {
        folder: "avatars",
      });
    console.log(result.public_id);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        address: data.address,
        avatar: { public_id: result.public_id, url: result.secure_url },
        name: data.name,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        birthday: data.birthday,
      }
    );
    user.save();
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// router.get("/sendotp", async (req, res) => {
//   try {

//       .then((message) => console.log(message));
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });

module.exports = router;
