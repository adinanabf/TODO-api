const AppError = require("../error/AppError");
const {
  TodoRepository: MongoTodoRepository,
} = require("./mongoDb/TodoRepository");

class TodoRepositoryFactory {
  static async createInstance({ db } = {}) {
    const target = db || process.env.DB || "mongo";

    if (target === "postgres") {
      const {
        TodoRepository: PostgresTodoRepository,
      } = require("./postgres/TodoRepository");
      return new PostgresTodoRepository();
    }

    return new MongoTodoRepository();
  }
}

module.exports = TodoRepositoryFactory;
