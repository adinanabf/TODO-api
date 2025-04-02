const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { TodoController } = require("../controllers/TodoController");
const { UserController } = require("../controllers/UserController");
const AppError = require("../error/AppError");
const todoController = new TodoController();
const userController = new UserController();

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.post("/TODO/create", checkToken, todoController.createTodo);

router.put("/TODO/close", checkToken, todoController.closeTodo);

router.put("/TODO/edit", checkToken, todoController.editTodo);

router.get("/TODO", checkToken, todoController.listTodos);

function checkToken(req, next) {
  const token = req.headers["authorization"];
  if (!token) {
    throw new AppError("Access denied. Token missing or invalid.", 401);
  }

  try {
    const decodedInfo = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedInfo._id;
    next();
  } catch (error) {
    throw new AppError("Access denied. Token missing or invalid.", 401);
  }
}

module.exports = router;
