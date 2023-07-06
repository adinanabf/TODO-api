const { UserRepository } = require("../repository/UserRepository");
const { TodoRepository } = require("../repository/TodoRepository");

async function verifyUserExistence(userId) {
  const userRepository = new UserRepository();
  const user = await userRepository.findById(userId);
  return user;
}

class TodoServices {
  constructor({ todoRepository }) {
    this.todoRepository = todoRepository;
  }

  async listTodos(userId) {
    const user = await verifyUserExistence(userId);
    if (!user) throw new Error("User not exists");

    const now = new Date();

    const TODOs = (await this.todoRepository.getUserTodos(userId)).map(
      (todo) => {
        const isPastDeadline = new Date(todo.deadline) < now;
        return {
          todoId: todo._id,
          description: todo.description,
          deadline: todo.deadline,
          statusConclusion: todo.statusConclusion,
          isPastDeadline,
          lastModification: todo.lastModification,
        };
      }
    );

    return TODOs;
  }

  async editTodo(userId, todoId, newDescription, newDeadline) {
    const user = await verifyUserExistence(userId);
    if (!user) throw new Error("User not exists");

    const todo = await this.todoRepository.getTodo(todoId);

    if (!todo) {
      return { status: 404, message: "TODO item not found." };
    }

    if (!newDescription && !newDeadline) {
      return { status: 400, message: "There is no change to be made." };
    }

    if (todo.statusConclusion) {
      return { status: 409, message: "TODO item already closed." };
    }

    todo.description =
      newDescription !== undefined ? newDescription : todo.description;

    todo.deadline = newDeadline !== undefined ? newDeadline : todo.deadline;

    todo.lastModification = new Date().toISOString();

    await this.todoRepository.saveTodo(todo);

    return { status: 200, message: "TODO item updated successfully." };
  }

  async createTodo(userId, description, deadline, statusConclusion) {
    const user = await verifyUserExistence(userId);
    if (!user) throw new Error("User not exists");

    const todo = await (this.todoRepository.createTodo(
      userId,
      description,
      deadline,
      statusConclusion !== undefined ? statusConclusion : false
    ));

    await this.todoRepository.saveTodo(todo);

    return {
      status: 201,
      message: "TODO created successfully.",
      todoId: todo._id,
    };
  }

  async closeTodo(userId, todoId) {
    try {
      const user = await verifyUserExistence(userId);

      if (!user) throw new Error("User not exists");

      // const todoRepository = new TodoRepository();

      const todo = await this.todoRepository.getTodo(todoId);

      if (!todo) {
        return { status: 404, message: "TODO item not found." };
      }

      if (todo.statusConclusion) {
        return { status: 409, message: "TODO item already closed." };
      }

      todo.statusConclusion = true;
      todo.lastModification = new Date().toISOString();

      await this.todoRepository.saveTodo(todo);

      return { status: 200, message: "TODO item closed successfully." };
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Error closing TODO item." };
    }
  }
}

module.exports = { TodoServices };
