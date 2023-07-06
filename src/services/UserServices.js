const { UserRepository } = require("../repository/UserRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserServices {
  async createUser(email, password) {
    const userRepository = new UserRepository();

    const emailExists = await userRepository.findByEmail(email);
    if (emailExists) return { status: 409, message: "Email already exists." };
  
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
  
    await userRepository.createUser(email, hashPassword);

    return { status: 201, message: "User created successfully." }
  };

  async loginUser(email, password) {
    const userRepository = new UserRepository();

    const user = await userRepository.findByEmail(email);

    if (!user) return { status: 404, message: "User not found." };
  
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return { status: 401, message: "Password incorrect." };
    
    const token = jwt.sign(
      {  _id: user._id, email: user.email },
      process.env.TOKEN_SECRET,
      {  expiresIn: "0.5hr" }
    );

    return { 
      status: 200, 
      message: "You are successfully logged in.", 
      token: token
    }
  }
}

module.exports = { UserServices };
