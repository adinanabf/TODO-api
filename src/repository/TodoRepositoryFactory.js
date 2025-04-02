const AppError = require("../error/AppError");
const {
  TodoRepository: MongoTodoRepository,
} = require("./mongoDb/TodoRepository");

const {
  TodoRepository: PostgresTodoRepository,
} = require("./postgres/TodoRepository");

class TodoRepositoryFactory {
  static async createInstance({ db }) {
    let repository;

    if (!db)
      throw new AppError(
        "No database was found. Please select a database.",
        400
      );

    if (db === "mongo") {
      repository = new MongoTodoRepository();
    } else {
      repository = new PostgresTodoRepository();
    }

    return repository;
  }
}

module.exports = TodoRepositoryFactory;
