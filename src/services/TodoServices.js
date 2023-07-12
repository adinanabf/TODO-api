const AppError = require("../error/AppError");

class TodoServices {
  constructor({ todoRepository, userRepository }) {
    this.todoRepository = todoRepository;
    this.userRepository = userRepository;
  }

  async listTodos(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not exists");

    const now = new Date();

    const TODOs = (await this.todoRepository.getUserTodos(userId)).map(
      (todo) => {
        const isPastDeadline = new Date(todo.deadline) < now;
        return {
          todoId: todo.id,
          description: todo.description,
          deadline: todo.deadline,
          statusconclusion: todo.statusconclusion,
          isPastDeadline,
          lastmodification: todo.lastmodification,
        };
      }
    );

    return TODOs;
  }

  async editTodo(userId, todoId, newDescription, newDeadline) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not exists");

    const todo = await this.todoRepository.getTodo(todoId);

    if (!todo) {
      return { status: 404, message: "TODO item not found." };
    }

    if (!newDescription && !newDeadline) {
      return { status: 400, message: "There is no change to be made." };
    }

    if (todo.statusconclusion) {
      // return { status: 409, message: "TODO item already closed." };

      throw new AppError("There is no change to be made.");
    }

    todo.description =
      newDescription !== undefined ? newDescription : todo.description;

    todo.deadline = newDeadline !== undefined ? newDeadline : todo.deadline;

    todo.lastmodification = new Date().toISOString();

    await this.todoRepository.saveTodo(todo);

    return { status: 200, message: "TODO item updated successfully." };
  }

  async createTodo(userId, description, deadline, statusconclusion) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not exists");

    const todo = await this.todoRepository.createTodo(
      userId,
      description,
      deadline,
      statusconclusion !== undefined ? statusconclusion : false
    );

    return {
      status: 201,
      message: "TODO created successfully.",
      todoId: todo.id,
    };
  }

  async closeTodo(userId, todoId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) throw new Error("User not exists");

      const todo = await this.todoRepository.getTodo(todoId);

      if (!todo) {
        return { status: 404, message: "TODO item not found." };
      }

      if (todo.statusconclusion) {
        return { status: 409, message: "TODO item already closed." };
      }

      todo.statusconclusion = true;
      todo.lastmodification = new Date().toISOString();

      await this.todoRepository.saveTodo(todo);

      return { status: 200, message: "TODO item closed successfully." };
    } catch (error) {
      console.log(error);
      return { status: 500, message: error.toString() };
    }
  }
}

module.exports = { TodoServices };
