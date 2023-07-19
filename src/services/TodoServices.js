const AppError = require("../error/AppError");

class TodoServices {
  constructor({ todoRepository, userRepository }) {
    this.todoRepository = todoRepository;
    this.userRepository = userRepository;
  }

  async listTodos(userId) {
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

  async editTodo(todoId, newDescription, newDeadline) {
    const todo = await this.todoRepository.getTodo(todoId);

    if (!todo) {
      throw new AppError("TODO item not found.", 404);
    }

    if (!newDescription && !newDeadline) {
      throw new AppError("There is no change to be made.", 400)
    }

    if (todo.statusconclusion) {
      throw new AppError("TODO item already closed.", 409);
    }

    todo.description =
      newDescription !== undefined ? newDescription : todo.description;

    todo.deadline = newDeadline !== undefined ? newDeadline : todo.deadline;

    todo.lastmodification = new Date().toISOString();

    await this.todoRepository.saveTodo(todo);

    return { status: 200, message: "TODO item updated successfully." };
  }

  async createTodo(userId, description, deadline, statusconclusion) {
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

  async closeTodo(todoId) {
    const todo = await this.todoRepository.getTodo(todoId);

    if (!todo) {
      throw new AppError("TODO item not found.", 404);
    }

    if (todo.statusconclusion) {
      throw new AppError("TODO item already closed.", 409);
    }

    todo.statusconclusion = true;
    todo.lastmodification = new Date().toISOString();

    await this.todoRepository.saveTodo(todo);

    return { status: 200, message: "TODO item closed successfully." };
  }
}

module.exports = { TodoServices };
