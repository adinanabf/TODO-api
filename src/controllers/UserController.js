const Joi = require("@hapi/joi");
const { UserServices } = require("../services/UserServices");


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

    const { UserRepository } =
      req.headers.db === 'mongo' ? 
      require("../repository/mongoDb/UserRepository") :
      require("../repository/postgres/UserRepository")

    const userRepository = new UserRepository;
    const userServices = new UserServices({ userRepository });

    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.toString() });

    try {
      const { email, password } = req.body;
      const result = await userServices.createUser(email, password)
      return res.status(result.status).json({ result });
    } catch (error) {
      return res.status(500).json({  error: error.toString() });
    }
  };

  async loginUser(req, res) {

    const { UserRepository } =
      req.headers.db === 'mongo' ? 
      require("../repository/mongoDb/UserRepository") :
      require("../repository/postgres/UserRepository")

    const userRepository = new UserRepository;
    const userServices = new UserServices({ userRepository });

    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.toString() });
  
    try {
      const { email, password } = req.body;
      const result = await userServices.loginUser(email, password);

      if (result.token) {
        return res.header("auth-token", result.token).status(result.status).json(result);
      } else {
        return res.status(result.status).json(result);
      }
      
    } catch (error) {
      return res.status(500).json({ error: error.toString() })
    }
  }
}

module.exports = { UserController };
