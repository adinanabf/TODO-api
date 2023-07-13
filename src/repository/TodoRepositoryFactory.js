const {
  TodoRepository: MongoTodoRepository,
} = require("./mongoDb/TodoRepository");

const {
  TodoRepository: PostgresTodoRepository,
} = require("./postgres/TodoRepository");

const getRepository = {
  mongo: MongoTodoRepository,
  postgres: PostgresTodoRepository,
};

class TodoRepositoryFactory {
  static async createInstance({ db }) {
    let repository;

    switch (db) {
      case "mongo":
        repository = new MongoTodoRepository();
    
    case "mysql": 
        repository = MySql()
      default:
        repository = new PostgresTodoRepository();
    }

    return repository;
  }
}
module.exports = TodoRepositoryFactory;
