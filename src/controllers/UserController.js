const Joi = require("@hapi/joi");
const { UserServices } = require("../services/UserServices");
const userServices = new UserServices();

// const { TodoServices } = require("../services/TodoServices");
// const todoServices = new TodoServices();

// class TodoController {
//   async listTodos(req, res) {
//     try {
//       const { userId } = req;

//       const result = await todoServices.listTodos(userId);

//       return res.status(200).json({ result });
//     } catch (error) {
//       return res.status(500).json({ error: error.toString() });
//     }
//   };
  
//   async editTodo(req, res){
//     const { error } = todoEditSchema.validate(req.body);
    
//     if (error) return res.status(400).json({ error: error.toString() });

//     try {
//       const { userId } = req;
//       const { todoId, newDescription, newDeadline } = req.body;

//       const result = await todoServices.editTodo(
//         userId, todoId, newDescription, newDeadline
//       );

//       return res.status(result.status).json({ result });

//     } catch (error) {
//       return res.status(500).json({ error: "Error updating TODO item." });
//     }
//   };
  
//   async createTodo(req, res){
//     const { error } = todoCreateSchema.validate(req.body);
    
//     if (error) return res.status(400).json({ error: error.toString() });
    
//     try {
//       const { userId } = req;
//       const { description } = req.body;
//       const { deadline } = req.body;
//       const { statusConclusion } = req.body;

//       const result = await todoServices.createTodo(
//         userId, description, deadline, statusConclusion
//       );
   
//       return res.status(result.status).json({ result });

//     } catch (error) {
//       return res.status(500).json({  error: error.toString() });
//     }
//   };

//   async closeTodo(req, res) {
//     const { error } = todoCloseSchema.validate(req.body);
    
//     if (error) return res.status(400).json({ error: error.toString() });
    
//     try {
//       const { userId } = req;
//       const { todoId } = req.body;

//       const result = await todoServices.closeTodo(userId, todoId);
   
//       return res.status(result.status).json({ result });

//     } catch (error) {
//       return res.status(500).json({  error: error.toString() });
//     }
//   }
// }

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
