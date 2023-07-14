const {
  TodoRepository: MongoTodoRepository,
} = require("./mongoDb/TodoRepository");

const {
  TodoRepository: PostgresTodoRepository,
} = require("./postgres/TodoRepository");

class TodoRepositoryFactory {
  static async createInstance({ db }) {
    let repository;

    if (db === "mongo"){
      console.log("mg")
      repository = new MongoTodoRepository();
    } else {
      console.log("pg")
      repository = new PostgresTodoRepository();
    }

    return repository;
  }
}

module.exports = TodoRepositoryFactory;
