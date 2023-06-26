const TODO = require("../models/TODO");
const User = require("../models/User");
const { TodoServices } = require("../services/TodoServices");

class TodoController {
  async listTodos(req, res) {
    try {
      const { userId } = req;

      const todoServices = new TodoServices();

      const result = await todoServices.listTodos(userId);

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ error: error.toString() });
    }
  }
}

module.exports = { TodoController };
