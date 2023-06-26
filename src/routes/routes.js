const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const TODO = require("../models/TODO");
const { TodoController } = require("../controllers/TodoController");

const registerSchema = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).max(255).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
});

const TODOcreateSchema = Joi.object({
  description: Joi.string().min(0).max(255).required(),
  deadline: Joi.date().iso().required(),
  statusConclusion: Joi.bool(),
});

const TODOCloseSchema = Joi.object({
  TODO_Id: Joi.string().length(24).required(),
});

const TODOEditSchema = Joi.object({
  TODO_Id: Joi.string().length(24).required(),
  newDescription: Joi.string().min(0).max(255),
  newDeadline: Joi.date().iso(),
});

const todoController = new TodoController();

router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error)
    return res.status(400).json({
      error: error.details[0].message.replace('"', "").replace('"', ""),
    });

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({
      error: "Email already exists.",
    });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: hashPassword,
  });

  try {
    await user.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      error: error.details[0].message.replace('"', "").replace('"', ""),
    });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({
      error: "User not found.",
    });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(401).json({
      error: "Password incorrect.",
    });

  try {
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "0.5hr",
      }
    );
    res.header("auth-token", token).status(200).json({
      message: "You are successfully logged in.",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error.",
    });
  }
});

router.post("/TODO/create", checkToken, async (req, res) => {
  const { error } = TODOcreateSchema.validate(req.body);

  if (error)
    return res.status(400).json({
      error: error.details[0].message.replace('"', "").replace('"', ""),
    });

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const status =
      req.body.statusConclusion !== undefined
        ? req.body.statusConclusion
        : false;

    const todo = new TODO({
      userId: req.userId,
      description: req.body.description,
      deadline: req.body.deadline,
      statusConclusion: status,
    });

    await todo.save();

    return res.status(201).json({
      message: "TODO created successfully.",
      TODO_Id: todo._id,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.put("/TODO/close", checkToken, async (req, res) => {
  const { error } = TODOCloseSchema.validate(req.body);

  if (error)
    return res.status(400).json({
      error: error.details[0].message.replace('"', "").replace('"', ""),
    });

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!req.body.TODO_Id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ error: "TODO item not found." });
    }

    const todo = await TODO.findById(req.body.TODO_Id);

    if (!todo)
      return res.status(404).json({
        error: "TODO item not found.",
      });

    if (todo.statusConclusion) {
      return res.status(409).json({ error: "TODO item already closed." });
    }

    todo.statusConclusion = true;
    todo.lastModification = new Date().toISOString();

    await todo.save();

    return res.status(200).json({ message: "TODO item closed successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error closing TODO item." });
  }
});

router.put("/TODO/edit", checkToken, async (req, res) => {
  const { error } = TODOEditSchema.validate(req.body);

  if (error)
    return res.status(400).json({
      error: error.details[0].message.replace('"', "").replace('"', ""),
    });

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!req.body.TODO_Id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ error: "TODO item not found." });
    }

    const todo = await TODO.findById(req.body.TODO_Id);

    if (!todo)
      return res.status(404).json({
        error: "TODO item not found.",
      });

    if (todo.statusConclusion) {
      return res.status(409).json({ error: "TODO item already closed." });
    }

    if (!("newDescription" in req.body) && !("newDeadline" in req.body)) {
      return res.status(400).json({
        error: "There is no change to be made.",
      });
    }

    const description =
      req.body.newDescription !== undefined
        ? req.body.newDescription
        : todo.description;

    const deadline =
      req.body.newDeadline !== undefined ? req.body.newDeadline : todo.deadline;

    todo.description = description;
    todo.deadline = deadline;
    todo.lastModification = new Date().toISOString();

    await todo.save();

    return res.status(200).json({ message: "TODO item updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Error updating TODO item." });
  }
});

router.get("/TODO", checkToken, todoController.listTodos);

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied. Token missing or invalid.",
    });
  }

  try {
    const decodedInfo = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedInfo._id;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Access denied. Token missing or invalid.",
    });
  }
}

module.exports = router;
