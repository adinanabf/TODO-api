const Todo = require("../models/TODO");

class TodoRepository {
  async getUserTodos(userId) {
    const todos = await Todo.find({ userId: userId }).exec();
    return todos;
  };

  async getTodo(todoId) {
    const todo = await Todo.findById(todoId);
    return todo;
  };

  async saveTodo(todo) {
    return todo.save()
  };

  async createTodo(userId, description, deadline, statusConclusion) {
    const todo = new Todo({
      userId,
      description,
      deadline,
      statusConclusion,
    });
    
    return todo;
  };

}

module.exports = { TodoRepository };
