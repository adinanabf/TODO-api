const database = require("../../db/postgres");

class UserRepository {
  async findById(userId) {
    if (!isNaN(userId)) {
      const client = await database.getConnection();

      const query = 'SELECT * FROM users WHERE id = $1';
      const values = [userId];
      const user = await client.query(query, values);

      return user.rows[0];
    } else {
      return
    }
  };
  
  async findByEmail(email) {
    const client = await database.getConnection();

    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const user = await client.query(query, values);
    return user.rows[0];
  };

  async saveUser(query, values) {
    const client = await database.getConnection();
    return await client.query(query, values);
  };

  async createUser(email, hashPassword) {
    const query = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
    const values = [email, hashPassword];

    const result = await this.saveUser(query, values);
    return result.rows[0];
  }
}

module.exports = { UserRepository };
