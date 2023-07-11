require('dotenv').config();
const { Pool } = require('pg');

class Database {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.getConnection();
      console.log("PostgreSQL connected.")
    } catch (error) {
      console.log("Failed to connect to postgres", error);
    }
  }

  async getConnection() {
    return new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres',
      port: 5432
    })
    // return new Pool({ connectionString: `${process.env.DATABASE_URL}` });
  }
}

module.exports = new Database();
