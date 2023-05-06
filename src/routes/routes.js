const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const registerSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required()
});

router.post("/register", async (req, res) => {
    const { error } = registerSchema.validate(req.body);

    if (error) return res.status(400).json({
      msg: error.details[0].message.replace('"','').replace('"', '')
    });
    
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).json({
      msg: "Email already exists."
    });
  
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
  
    const user = new User({
      email: req.body.email,
      password: hashPassword,
    });
  
    try {
      await user.save();
      res.status(201).json({msg: "User created successfully."});
    } catch (error) {
      res.status(500).json({msg: error});
    }
});

router.post("/login", async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({
      msg: error.details[0].message.replace('"', '')
    });
  
    const user = await User.findOne({ email: req.body.email });
    // console.log(user.password)
    if (!user) return res.status(404).json({
      msg: "User not found."
    });
    
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(422).json({
      msg: "Password incorrect."
    });
  
    try {
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).json({
          msg: "You are successfully logged in.",
          token: token
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({msg: error});
    }
  });

module.exports = router;
