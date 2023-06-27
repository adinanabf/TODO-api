const User = require("../models/User");

class UserRepository {
  async findById(userId) {
    const user = await User.findById(userId);

    return user;
  }
}

module.exports = { UserRepository };
