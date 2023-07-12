require('dotenv').config();
const { Pool } = require('pg');

class Database {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.createSchema();
      await this.createUserTable();
      await this.createTodoTable();
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
  };

  async createSchema() {
    const schemaScript = `CREATE SCHEMA IF NOT EXISTS todo_api`;

    const pool = await this.getConnection();
    await pool.query(schemaScript);
    await pool.end();
  };

  async createUserTable() {
    const tableScript = `CREATE TABLE IF NOT EXISTS todo_api.user (
          id SERIAL PRIMARY KEY,
  	      email VARCHAR(255) NOT NULL,
  	      password VARCHAR(255) NOT NULL,
	        user_creation TIMESTAMP DEFAULT current_timestamp
    )`;

    const pool = await this.getConnection();
    await pool.query(tableScript);
    await pool.end();
  };

  async createTodoTable() {
    const tableScript = `CREATE TABLE IF NOT EXISTS todo_api.todo (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES todo_api.user(id),
          description VARCHAR(255) NOT NULL,
          deadline TIMESTAMP,
          statusconclusion boolean,
          lastmodification TIMESTAMP DEFAULT current_timestamp
    )`;

    const pool = await this.getConnection();
    await pool.query(tableScript);
    await pool.end();
  }
}

module.exports = new Database();
