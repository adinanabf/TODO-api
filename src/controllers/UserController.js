const Joi = require("@hapi/joi");
const { UserServices } = require("../services/UserServices");
const AppError = require("../error/AppError");
const UserRepositoryFactory = require("../repository/UserRepositoryFactory");

const registerSchema = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).max(255).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
});

class UserController {
  async createUser(req, res) {
    const { db } = req.headers;

    const userRepository = await UserRepositoryFactory.createInstance({ db });

    const userServices = new UserServices({ userRepository });

    const { error } = registerSchema.validate(req.body);
    if (error) throw new AppError(error.toString());

    const { email, password } = req.body;
    const result = await userServices.createUser(email, password);
    return res.status(result.status).json({ result });
  }

  async loginUser(req, res) {
    const { db } = req.headers;

    const userRepository = await UserRepositoryFactory.createInstance({ db });

    const userServices = new UserServices({ userRepository });

    const { error } = loginSchema.validate(req.body);
    if (error) throw new AppError(error.toString());

    const { email, password } = req.body;
    const result = await userServices.loginUser(email, password);

    if (result.token) {
      return res
        .header("auth-token", result.token)
        .status(result.status)
        .json(result);
    } else {
      return res.status(result.status).json(result);
    }
  }
}

module.exports = { UserController };
