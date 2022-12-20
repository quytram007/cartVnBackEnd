const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: Object },
  name: { type: String },
  phoneNumber: { type: String },
  gender: { type: String },
  birthday: { type: String },
  address: { type: String },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, fullName: this.fullName },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    rePassword: Joi.string().required().label("RePassWord"),
    phoneNumber: Joi.string().required().label("phoneNumber"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
