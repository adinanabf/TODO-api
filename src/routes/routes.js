const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const registerSchema = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).max(255).required()
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required()
});

const TODOSchema = Joi.object({
  description: Joi.string().min(0).max(255).required(),
  deadline: Joi.date().iso().required(),
  statusConclusion: Joi.bool(),
  datetimeConclusion: Joi.date().iso()
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
    if (!user) return res.status(404).json({
      msg: "User not found."
    });
    
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(422).json({
      msg: "Password incorrect."
    });
  
    try {
      const token = jwt.sign({
          _id: user._id,
          email: user.email 
        },
        process.env.TOKEN_SECRET, {
          expiresIn: "0.5hr"
        });
      res.header("auth-token", token).json({
          msg: "You are successfully logged in.",
          token: token
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({msg: 'Internal Server Error.'});
    }
  });


router.post("/TODO/create", checkToken, async(req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const decodedInfo = jwt.verify(token, process.env.TOKEN_SECRET);

  const { error } = TODOSchema.validate(req.body);

  if (error) return res.status(400).json({
    msg: error.details[0].message.replace('"','').replace('"', '')
  });

  const user = await User.findById(decodedInfo._id);

  const unique_TODO = user.TODO.find(
    item => item.description === req.body.description
  );

  const now = new Date();
  const timestampISO = now.toISOString();

  if (!unique_TODO) {
    const todo = {
      description: req.body.description,
      deadline: req.body.deadline,
      lastModification: timestampISO
    };

    try {
      user.TODO.push(todo);
      await user.save();
      res.status(201).json({msg: "TODO created successfully."});
    } catch (error) {
      res.status(500).json({msg: error});
    }
  } else {
    res.status(409).json({msg: "The description must be unique."});
  }
})

function checkToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token){
    return res.status(401).json({ msg: 'Access denied.'});
  }

  try {
    const secret = process.env.TOKEN_SECRET;
    jwt.verify(token, secret);
    next ();
  } catch(error) {
    res.status(400).json({ msg: 'Invalid token.'});
  }
}

module.exports = router;
