const User = require("../models/User");

class UserRepository {
  async findById(userId) {
    const user = await User.findById(userId);
    return user;
  };
  
  async findByEmail(email) {
    const user = await User.findOne({ email: email })
    return user;
  };

  async saveUser(user) {
    return user.save()
  };

  async createUser(email, hashPassword) {
    const user = new User({
      email: email,
      password: hashPassword,
    });
    
    await this.saveUser(user);
    return user;
  }
}

module.exports = { UserRepository };
