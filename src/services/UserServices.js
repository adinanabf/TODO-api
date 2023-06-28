const { UserRepository } = require("../repository/UserRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// class TodoServices {

//   async listTodos(userId) {
//     const user = await verifyUserExistence(userId);
//     if (!user) throw new Error("User not exists");

//     const todoRepository = new TodoRepository();

//     const now = new Date();

//     const TODOs = (await todoRepository.getUserTodos(userId)).map((todo) => {
//       const isPastDeadline = new Date(todo.deadline) < now;
//       return {
//         todoId: todo._id,
//         description: todo.description,
//         deadline: todo.deadline,
//         statusConclusion: todo.statusConclusion,
//         isPastDeadline,
//         lastModification: todo.lastModification,
//       };
//     });

//     return TODOs;
//   };

//   async editTodo(userId, todoId, newDescription, newDeadline) {
//     const user = await verifyUserExistence(userId);
//     if (!user) throw new Error("User not exists");

//     const todoRepository = new TodoRepository();

//     const todo = await todoRepository.getTodo(todoId);

//     if (!todo) {
//       return { status: 404, message: "TODO item not found." };
//     }

//     if (!newDescription && !newDeadline) {
//       return { status: 400, message: "There is no change to be made." };
//     }

//     if (todo.statusConclusion) {
//       return { status: 409, message: "TODO item already closed." };
//     }

//     todo.description = newDescription !== undefined 
//       ? newDescription 
//       : todo.description;
      
//     todo.deadline = newDeadline !== undefined 
//       ? newDeadline 
//       : todo.deadline;;

//     todo.lastModification = new Date().toISOString();

//     await todoRepository.saveTodo(todo);

//     return { status: 200, message: "TODO item updated successfully." };
//   };

//   async createTodo(userId, description, deadline, statusConclusion){
//     const user = await verifyUserExistence(userId);
//     if (!user) throw new Error("User not exists");

//     const todoRepository = new TodoRepository();

//     const todo = await todoRepository.createTodo(
//       userId,
//       description,
//       deadline,
//       statusConclusion !== undefined
//         ? statusConclusion
//         : false,
//     );
  
//     await todoRepository.saveTodo(todo);

//     return { status: 201, 
//       message: "TODO created successfully.", 
//       todoId: todo._id 
//     }
//   };

//   async closeTodo(userId, todoId){
//     try {
//       const user = await verifyUserExistence(userId);

//       if (!user) throw new Error("User not exists");

//       const todoRepository = new TodoRepository();

//       const todo = await todoRepository.getTodo(todoId);
      
//       if (!todo) {
//         return { status: 404, message: "TODO item not found." };
//       }
  
//       if (todo.statusConclusion) {
//         return { status: 409, message: "TODO item already closed." }
//       }
  
//       todo.statusConclusion = true;
//       todo.lastModification = new Date().toISOString();
  
//       await todoRepository.saveTodo(todo);
  
//       return { status: 200, message: "TODO item closed successfully." };

//     } catch (error) {
//       console.log(error);
//       return { status: 500, message: "Error closing TODO item." };
//     }
//   };
// }

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
