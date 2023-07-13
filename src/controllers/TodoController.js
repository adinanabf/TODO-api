const Joi = require("@hapi/joi");
const { TodoServices } = require("../services/TodoServices");
const AppError = require("../error/AppError");
const TodoRepositoryFactory = require("../repository/TodoRepositoryFactory");

const todoEditSchema = Joi.object({
  // todoId: Joi.string()
  //   .regex(/^[0-9a-fA-F]{24}$/)
  //   .required(),
  todoId: Joi.required(),
  newDescription: Joi.string().min(0).max(255),
  newDeadline: Joi.date().iso(),
});

const todoCreateSchema = Joi.object({
  description: Joi.string().min(0).max(255).required(),
  deadline: Joi.date().iso().required(),
  statusconclusion: Joi.bool(),
});

const todoCloseSchema = Joi.object({
  todoId: Joi.required(),
});

class TodoController {
  async listTodos(req, res) {
    const { TodoRepository } =
      req.headers.db === "mongo"
        ? require("../repository/mongoDb/TodoRepository")
        : require("../repository/postgres/TodoRepository");
    const todoRepository = new TodoRepository();

    const { UserRepository } =
      req.headers.db === "mongo"
        ? require("../repository/mongoDb/UserRepository")
        : require("../repository/postgres/UserRepository");
    const userRepository = new UserRepository();

    const todoServices = new TodoServices({ todoRepository, userRepository });

    try {
      const { userId } = req;

      const result = await todoServices.listTodos(userId);

      return res.status(200).json({ result });
    } catch (error) {
      throw new AppError(error.toString(), 500);
    }
  }

  async editTodo(req, res) {
    const { db } = req.headers;

    const todoRepository = TodoRepositoryFactory.createInstance({ db });

    const { UserRepository } =
      req.headers.db === "mongo"
        ? require("../repository/mongoDb/UserRepository")
        : require("../repository/postgres/UserRepository");
    const userRepository = new UserRepository();

    const todoServices = new TodoServices({ todoRepository, userRepository });

    const { error } = todoEditSchema.validate(req.body);
    if (error) throw new AppError(error.toString(), 400);

    try {
      const { userId } = req;
      const { todoId, newDescription, newDeadline } = req.body;

      const result = await todoServices.editTodo(
        userId,
        todoId,
        newDescription,
        newDeadline
      );

      return res.status(result.status).json({ result });
    } catch (error) {
      throw new AppError("Error updating TODO item.", 500);
    }
  }

  async createTodo(req, res) {
    const { TodoRepository } =
      req.headers.db === "mongo"
        ? require("../repository/mongoDb/TodoRepository")
        : require("../repository/postgres/TodoRepository");
    const todoRepository = new TodoRepository();

    const { UserRepository } =
      req.headers.db === "mongo"
        ? require("../repository/mongoDb/UserRepository")
        : require("../repository/postgres/UserRepository");
    const userRepository = new UserRepository();

    const todoServices = new TodoServices({ todoRepository, userRepository });

    const { error } = todoCreateSchema.validate(req.body);

    if (error) throw new AppError(error.toString(), 500);

    try {
      const { userId } = req;
      const { description } = req.body;
      const { deadline } = req.body;
      const { statusconclusion } = req.body;

      const result = await todoServices.createTodo(
        userId,
        description,
        deadline,
        statusconclusion
      );

      return res.status(result.status).json({ result });
    } catch (error) {
      console.log(error);
      throw new AppError(error.toString());
    }
  }

  async closeTodo(req, res) {
    const { TodoRepository } =
      req.headers.db === "mongo"
        ? require("../repository/mongoDb/TodoRepository")
        : require("../repository/postgres/TodoRepository");
    const todoRepository = new TodoRepository();

    const { UserRepository } =
      req.headers.db === "mongo"
        ? require("../repository/mongoDb/UserRepository")
        : require("../repository/postgres/UserRepository");
    const userRepository = new UserRepository();

    const todoServices = new TodoServices({ todoRepository, userRepository });

    const { error } = todoCloseSchema.validate(req.body);
    if (error) throw new AppError(error.toString(), 400);

    try {
      const { userId } = req;
      const { todoId } = req.body;

      const result = await todoServices.closeTodo(userId, todoId);

      return res.status(result.status).json({ result });
    } catch (error) {
      throw new AppError(error.toString(), 500);
    }
  }
}

module.exports = { TodoController };
