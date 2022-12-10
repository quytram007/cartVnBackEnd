const router = require("express").Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");


 const verifyAction = (token) =>{
    
        let data = null;
        
        try {
            let decoded = jwt.verify(token,process.env.JWTPRIVATEKEY)
            data = decoded;
        } catch (error) {
            console.log(error);
        }
        return data;
}
module.exports = verifyAction;
          