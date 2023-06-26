const User = require("../models/User");

class TodoRepository {
  async findById(userId) {
    const user = await User.findById(userId);

    return user;
  }
}

module.exports = { TodoRepository };
