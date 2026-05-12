const AppError = require("../error/AppError");
const {
  UserRepository: MongoUserRepository,
} = require("./mongoDb/UserRepository");

class UserRepositoryFactory {
  static async createInstance({ db } = {}) {
    const target = db || process.env.DB || "mongo";

    if (target === "postgres") {
      const {
        UserRepository: PostgresUserRepository,
      } = require("./postgres/UserRepository");
      return new PostgresUserRepository();
    }

    return new MongoUserRepository();
  }
}

module.exports = UserRepositoryFactory;
