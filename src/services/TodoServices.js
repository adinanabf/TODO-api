const TODO = require("../models/TODO");
const User = require("../models/User");
const { TodoRepository } = require("../repository/TodoRepository");

class TodoServices {
  async listTodos(userId) {
    const todoRepository = new TodoRepository();

    const user = await todoRepository.findById(userId);

    if (!user) {
      throw new Error("User not exists");
    }

    const now = new Date();

    const TODOs = (await TODO.find({ userId: userId }).exec()).map((todo) => {
      const isPastDeadline = new Date(todo.deadline) < now;
      return {
        // ...todo.toObject(),
        TODO_Id: todo._id,
        description: todo.description,
        deadline: todo.deadline,
        statusConclusion: todo.statusConclusion,
        isPastDeadline,
        lastModification: todo.lastModification,
      };
    });

    return TODOs;
  }
}

module.exports = { TodoServices };
