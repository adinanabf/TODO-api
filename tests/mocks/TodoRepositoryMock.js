const { v4 } = require("uuid");

class TodoRepositoryMock {
    todos = [];
  
    async getUserTodos(userId) {
      const todos = this.todos.filter((todo) => todo.userId === userId)
      return todos;
    };
  
    async getTodo(todoId) {
      const todo = this.todos.find((todo) => todo.id === todoId);
      return todo;
    };
  
    async saveTodo(todo) {
      todo.id = v4();
  
      this.todos.push(todo);
      return todo;
    };
  
    async createTodo(userId, description, deadline, statusconclusion) {
      const todo = {
        userId,
        description,
        deadline,
        statusconclusion,
      };
      
      return this.todos.push(todo);
    };
}

module.exports = { TodoRepositoryMock };
