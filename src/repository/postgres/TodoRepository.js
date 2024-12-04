const database = require("../../db/postgres");

class TodoRepository {
  async getUserTodos(userId) {
    const client = await database.getConnection();
    const query = "SELECT * FROM todo_api.todo WHERE user_id = $1";
    const values = [userId];
    const todos = await client.query(query, values);
    client.end();
    return todos.rows;
  }

  async getTodo(todoId) {
    const client = await database.getConnection();
    const query = "SELECT * FROM todo_api.todo WHERE id = $1";
    const values = [todoId];
    const todo = await client.query(query, values);
    client.end();
    return todo.rows[0];
  }

  async createTodo(userId, description, deadline, statusconclusion) {
    const client = await database.getConnection();
    const query =
      "INSERT INTO todo_api.todo (user_id, description, deadline, statusconclusion) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [userId, description, deadline, statusconclusion];
    const result = await client.query(query, values);
    client.end();
    return result.rows[0];
  }

  async saveTodo(todo) {
    const client = await database.getConnection();
    let timestamp = new Date().toISOString();
    const query =
      "UPDATE todo_api.todo SET description = $1, deadline = $2, statusconclusion = $3, lastmodification = $4 WHERE id = $5 RETURNING *";
    const values = [
      todo.description,
      todo.deadline,
      todo.statusconclusion,
      timestamp,
      todo.id,
    ];
    const result = await client.query(query, values);
    client.end();
    return result.rows[0];
  }
}

module.exports = { TodoRepository };
