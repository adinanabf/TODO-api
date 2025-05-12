const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../error/AppError");
require("dotenv").config();

class UserServices {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async createUser(email, password) {
    const emailExists = await this.userRepository.findByEmail(email);
    if (emailExists) throw new AppError("Email already exists.", 409);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await this.userRepository.createUser(email, hashPassword);
    return {
      status: 201,
      message: "User created successfully.",
      userId: user.id,
    };
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new AppError("User not found.", 404);

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) throw new AppError("Password incorrect.", 401);

    const token = jwt.sign(
      { _id: user.id, email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "1hr" }
    );

    return {
      status: 200,
      message: "You are successfully logged in.",
      token: token,
    };
  }
}

module.exports = { UserServices };
