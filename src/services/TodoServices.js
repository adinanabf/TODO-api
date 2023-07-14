const AppError = require("../error/AppError");

class TodoServices {
  constructor({ todoRepository, userRepository }) {
    this.todoRepository = todoRepository;
    this.userRepository = userRepository;
  }

  async listTodos(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("User not exists", 404);

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
    if (!user) throw new AppError("User not exists", 404);

    const todo = await this.todoRepository.getTodo(todoId);

    if (!todo) {
      throw new AppError("TODO item not found.", 404);
    }

    if (!newDescription && !newDeadline) {
      throw new AppError("There is no change to be made", 400)
    }

    if (todo.statusconclusion) {
      throw new AppError("TODO item already closed.", 409);
    }

    try {
      todo.description =
        newDescription !== undefined ? newDescription : todo.description;

      todo.deadline = newDeadline !== undefined ? newDeadline : todo.deadline;

      todo.lastmodification = new Date().toISOString();

      await this.todoRepository.saveTodo(todo);

      return { status: 200, message: "TODO item updated successfully." };
    } catch (error) {
      throw new AppError("Error updating TODO item.", 500);
    }
  }

  async createTodo(userId, description, deadline, statusconclusion) {
    try {
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
    } catch(error) {
      throw new AppError(error.message)
    }
  }

  async closeTodo(userId, todoId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) throw new AppError("User not exists");

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
    } catch (error) {
      console.log(error);
      throw new AppError(error.toString(), 500);
    }
  }
}

module.exports = { TodoServices };
