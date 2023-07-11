const Joi = require("@hapi/joi");
const { TodoServices } = require("../services/TodoServices");

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
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/TodoRepository") :
    require("../repository/postgres/TodoRepository")
    const todoRepository = new TodoRepository();

    const { UserRepository } =
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/UserRepository") :
    require("../repository/postgres/UserRepository")
    const userRepository = new UserRepository;
    
    const todoServices = new TodoServices({ todoRepository, userRepository });

    try {
      const { userId } = req;

      const result = await todoServices.listTodos(userId);

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  }

  async editTodo(req, res) {

    const { TodoRepository } =
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/TodoRepository") :
    require("../repository/postgres/TodoRepository")
    const todoRepository = new TodoRepository();

    const { UserRepository } =
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/UserRepository") :
    require("../repository/postgres/UserRepository")
    const userRepository = new UserRepository;
  
    const todoServices = new TodoServices({ todoRepository, userRepository });

    const { error } = todoEditSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.toString() });

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
      return res.status(500).json({ error: "Error updating TODO item." });
    }
  }

  async createTodo(req, res) {
    const { TodoRepository } =
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/TodoRepository") :
    require("../repository/postgres/TodoRepository")
    const todoRepository = new TodoRepository();

    const { UserRepository } =
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/UserRepository") :
    require("../repository/postgres/UserRepository")
    const userRepository = new UserRepository;
  
    const todoServices = new TodoServices({ todoRepository, userRepository });

    const { error } = todoCreateSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.toString() });

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
      console.log(error)
      return res.status(500).json({ error: error.toString() });
    }
  }

  async closeTodo(req, res) {
    const { TodoRepository } =
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/TodoRepository") :
    require("../repository/postgres/TodoRepository")
    const todoRepository = new TodoRepository();

    const { UserRepository } =
    req.headers.db === 'mongo' ? 
    require("../repository/mongoDb/UserRepository") :
    require("../repository/postgres/UserRepository")
    const userRepository = new UserRepository;
  
    const todoServices = new TodoServices({ todoRepository, userRepository });

    const { error } = todoCloseSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.toString() });

    try {
      const { userId } = req;
      const { todoId } = req.body;

      const result = await todoServices.closeTodo(userId, todoId);

      return res.status(result.status).json({ result });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  }
}

module.exports = { TodoController };
