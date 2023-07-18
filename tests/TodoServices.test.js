const AppError = require("../src/error/AppError");
const { UserServices } = require("../src/services/UserServices");
const { TodoServices } = require("../src/services/TodoServices");
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

class TodoRepositoryMock {
  todos = [];

  async getUserTodos(userId) {
    const todos = this.todos.filter((todo) => todo.userId === userId)
    return todos;
  };

  async getTodo(todoId) {
    const todo = this.todos.find((todo) => todo.id === todoId);
    return todo;
  };

  async saveTodo(todo) {
    todo.id = v4();

    this.todos.push(todo);
    return todo;
  };

  async createTodo(userId, description, deadline, statusconclusion) {
    const todo = {
      userId,
      description,
      deadline,
      statusconclusion,
    };
    
    return this.todos.push(todo);
  };
}

describe("Todo Services test", () => {
  let userServices;
  let todoServices;

  beforeEach(() => {
    const userRepository = new UserRepositoryMock();
    const todoRepository = new TodoRepositoryMock();

    todoServices = new TodoServices({ todoRepository, userRepository });
    userServices = new UserServices({ userRepository });

    jest.resetAllMocks();
  });

  it("Should be possible to get all todos", async () => {
    const email = "peter@marvel.com";
    const password = "spider";
    const createUser = await userServices.createUser(email, password);
    const userId = createUser.userId;

    const todo1Description = "Read the bible";
    const todo1Deadline = "2023-10-12";

    await todoServices.createTodo(userId, todo1Description, todo1Deadline)

    const todo2Description = "Write an article";
    const todo2Deadline = "2023-6-10";
    const todo2status = true;

    await todoServices.createTodo(userId, todo2Description, todo2Deadline, todo2status)

    const allTodos = await todoServices.listTodos(userId);

    expect(allTodos[0].description).toStrictEqual(todo1Description);
    expect(allTodos[1].description).toStrictEqual(todo2Description);
    expect(allTodos[1].statusconclusion).toEqual(todo2status);
    expect(Object.keys(allTodos).length).toEqual(2);
  });

  it("Should not be possible to get all todos without login", async () => {
    const userId = v4();

    await expect(
      todoServices.listTodos(userId)).rejects.toEqual(
      new AppError("User not exists.", 401))
  });

  it("Should be possible to create a todo", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    const userId = createUser.userId;
    const todoDescription = "Read the bible";
    const todoDeadline = "2023-10-12";

    const createTodo = await todoServices.createTodo(userId, todoDescription, todoDeadline)

    expect(createTodo.message).toStrictEqual("TODO created successfully.");
    expect(createTodo.status).toStrictEqual(201);
    expect(createTodo).toHaveProperty("todoId");
  });

  it("Should not be possible to create a todo", async () => {
    const userId = v4();
    const todoDescription = "Read the bible";
    const todoDeadline = "2023-10-12";

    await expect(
      todoServices.createTodo(userId, todoDescription, todoDeadline
      )).rejects.toEqual(
      new AppError("User not exists.", 401))
  });

  it("Should be possible to edit a todo", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    const userId = createUser.userId;
    const todoDescription = "Read the bible";
    const todoDeadline = "2023-10-12";

    const createTodo = await todoServices.createTodo(userId, todoDescription, todoDeadline)

    const newTodoDeadline = "2024-10-12";

    const editTodo = await todoServices.editTodo(userId, createTodo.todoId, "", newTodoDeadline)

    expect(editTodo.message).toStrictEqual("TODO item updated successfully.");
    expect(editTodo.status).toStrictEqual(200);
  });

  it("Should not be possible to edit a todo without registration", async () => {
    const userId = v4();
    const newTodoDeadline = "2024-10-12";

    await expect(todoServices.editTodo(userId, "", "", newTodoDeadline)).rejects.toEqual(
      new AppError("User not exists.", 401))
  });

  it("Should not be possible to edit a todo without description & deadline", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    const userId = createUser.userId;
    const todoDescription = "Read the bible";
    const todoDeadline = "2023-10-12";

    const createTodo = await todoServices.createTodo(userId, todoDescription, todoDeadline)

    await expect(todoServices.editTodo(userId, createTodo.todoId, "", "")).rejects.toEqual(
      new AppError("There is no change to be made.", 400))
  });

  it("Should not be possible to edit a finished todo", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    const userId = createUser.userId;
    const todoDescription = "Read the bible";
    const todoDeadline = "2023-10-12";
    const todoStatusConclusion = true;

    const createTodo = await todoServices.createTodo(
      userId, todoDescription, todoDeadline,todoStatusConclusion
    );

    const todoNewDescription = "Read the entire bible";

    await expect(
      todoServices.editTodo(userId, createTodo.todoId, todoNewDescription, ""
      )).rejects.toEqual(
      new AppError("TODO item already closed.", 409))
  });

  it("Should not be possible to edit an unexistent todo", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);
    const userId = createUser.userId;

    const todoId = v4()
    const todoNewDescription = "Read the entire bible";

    await expect(
      todoServices.editTodo(userId, todoId, todoNewDescription, ""
      )).rejects.toEqual(
      new AppError("TODO item not found.", 404))
  });

  it("Should not be possible to close a finished todo", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    const userId = createUser.userId;
    const todoDescription = "Read the bible";
    const todoDeadline = "2023-10-12";
    const todoStatusConclusion = true;

    const createTodo = await todoServices.createTodo(
      userId, todoDescription, todoDeadline,todoStatusConclusion
    );

    await expect(
      todoServices.closeTodo(userId, createTodo.todoId)).rejects.toEqual(
      new AppError("TODO item already closed.", 409))
  });

  it("Should not be possible to close a todo without registration", async () => {
    const userId = v4();
    const todoId = v4();

    await expect(todoServices.closeTodo(userId, todoId)).rejects.toEqual(
      new AppError("User not exists.", 401))
  });

  it("Should not be possible to close an unexistent todo", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    const userId = createUser.userId;
    const todoId = v4();

    await expect(todoServices.closeTodo(userId, todoId)).rejects.toEqual(
      new AppError("TODO item not found.", 404))
  });
  
  it("Should be possible to close a todo", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    const userId = createUser.userId;
    const todoDescription = "Read the bible";
    const todoDeadline = "2023-10-12";

    const createTodo = await todoServices.createTodo(userId, todoDescription, todoDeadline)

    const closeTodo = await todoServices.closeTodo(userId, createTodo.todoId)

    expect(closeTodo.message).toStrictEqual("TODO item closed successfully.");
    expect(closeTodo.status).toStrictEqual(200);
  });
});
