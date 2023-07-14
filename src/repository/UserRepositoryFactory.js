const {
  UserRepository: MongoUserRepository,
} = require("./mongoDb/UserRepository");

const {
  UserRepository: PostgresUserRepository,
} = require("./postgres/UserRepository");


class UserRepositoryFactory {
  static async createInstance({ db }) {
    let repository;

    if (db === "mongo"){
      repository = new MongoUserRepository();
    } else {
      repository = new PostgresUserRepository();
    }

    return repository;
  }
}

module.exports = UserRepositoryFactory;
