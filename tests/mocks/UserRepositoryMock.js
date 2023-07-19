const { v4 } = require("uuid");


class UserRepositoryMock {
    users = [];
  
    async findById(userId) {
      const user = this.users.find((user) => user.id === userId);
      return user;
    }
  
    async findByEmail(email) {
      const user = this.users.find((user) => user.email === email);
      return user;
    }
  
    async saveUser(user) {
      user.id = v4();
  
      this.users.push(user);
      return user;
    }
  
    async createUser(email, hashPassword) {
      const user = {
        id: v4(),
        email: email,
        password: hashPassword,
      };
  
      this.users.push(user);
      return user;
    }
  }

module.exports = { UserRepositoryMock };