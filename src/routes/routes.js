const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { TodoController } = require("../controllers/TodoController");
const { UserController } = require("../controllers/UserController");
const todoController = new TodoController();
const userController = new UserController();

router.post("/register", userController.createUser);

router.post("/login", userController.loginUser); 

router.post("/TODO/create", checkToken, todoController.createTodo);

router.put("/TODO/close", checkToken, todoController.closeTodo);

router.put("/TODO/edit", checkToken, todoController.editTodo);

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
