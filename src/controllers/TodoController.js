const Joi = require("@hapi/joi");
const { TodoServices } = require("../services/TodoServices");
const todoServices = new TodoServices();

const todoEditSchema = Joi.object({
  todoId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  newDescription: Joi.string().min(0).max(255),
  newDeadline: Joi.date().iso(),
});

const todoCreateSchema = Joi.object({
  description: Joi.string().min(0).max(255).required(),
  deadline: Joi.date().iso().required(),
  statusConclusion: Joi.bool(),
});

const todoCloseSchema = Joi.object({
  todoId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

class TodoController {
  async listTodos(req, res) {
    try {
      const { userId } = req;

      const result = await todoServices.listTodos(userId);

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  };
  
  async editTodo(req, res){
    const { error } = todoEditSchema.validate(req.body);
    
    if (error) return res.status(400).json({ error: error.toString() });

    try {
      const { userId } = req;
      const { todoId, newDescription, newDeadline } = req.body;

      const result = await todoServices.editTodo(
        userId, todoId, newDescription, newDeadline
      );

      return res.status(result.status).json({ result });

    } catch (error) {
      return res.status(500).json({ error: "Error updating TODO item." });
    }
  };
  
  async createTodo(req, res){
    const { error } = todoCreateSchema.validate(req.body);
    
    if (error) return res.status(400).json({ error: error.toString() });
    
    try {
      const { userId } = req;
      const { description } = req.body;
      const { deadline } = req.body;
      const { statusConclusion } = req.body;

      const result = await todoServices.createTodo(
        userId, description, deadline, statusConclusion
      );
   
      return res.status(result.status).json({ result });

    } catch (error) {
      return res.status(500).json({  error: error.toString() });
    }
  };

  async closeTodo(req, res) {
    const { error } = todoCloseSchema.validate(req.body);
    
    if (error) return res.status(400).json({ error: error.toString() });
    
    try {
      const { userId } = req;
      const { todoId } = req.body;

      const result = await todoServices.closeTodo(userId, todoId);
   
      return res.status(result.status).json({ result });

    } catch (error) {
      return res.status(500).json({  error: error.toString() });
    }
  }
}

module.exports = { TodoController };
