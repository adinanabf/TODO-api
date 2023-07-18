const AppError = require("../src/error/AppError");
const { UserServices } = require("../src/services/UserServices");
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

describe("User Services test", () => {
  let userServices;

  beforeEach(() => {
    const userRepository = new UserRepositoryMock();
    userServices = new UserServices({ userRepository });
    jest.resetAllMocks();
  });

  it("Should be possible to create an user", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    const createUser = await userServices.createUser(email, password);

    expect(createUser.message).toStrictEqual("User created successfully.");
    expect(createUser.status).toStrictEqual(201);
  });

  it("Should not be possible to create an user with an existent email", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    await userServices.createUser(email, password);

    await expect(userServices.createUser(email, "spidergwen")).rejects.toEqual(
      new AppError("Email already exists.", 409)
    );
  });

  it("Should not be possible to login with an unexistent user", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    await expect(userServices.loginUser(email, password)).rejects.toEqual(
      new AppError("User not found.", 404)
    );
  });

  it("Should not be possible to login with an incorrect password", async () => {
    const email = "peter@marvel.com";
    const password = "spider";
    const wrong_password = "spiderman";

    await userServices.createUser(email, password);

    await expect(userServices.loginUser(email, wrong_password)).rejects.toEqual(
      new AppError("Password incorrect.", 401)
    );
  });

  it("Should be possible to login", async () => {
    const email = "peter@marvel.com";
    const password = "spider";

    await userServices.createUser(email, password);
    const loginUser = await userServices.loginUser(email, password);

    expect(loginUser.message).toStrictEqual("You are successfully logged in.");
    expect(loginUser.status).toStrictEqual(200);
    expect(loginUser).toHaveProperty("token")
  });
});
