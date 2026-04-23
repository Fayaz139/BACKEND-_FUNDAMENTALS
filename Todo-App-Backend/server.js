const express = require('express');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./authMiddleware');

const app = express();
app.use(express.json());

let todoId = 1;
let userId = 1;

let users = [];
let todos = [];

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let userExist = users.find(u => u.username === username);

    if (userExist) {
        return res.status(409).json({ message: "User already exists!" })
    }

    const newUser = {
        id: userId++,
        username,
        password,
        todos: []
    }
    users.push(newUser);

    res.status(201).json({ message: "Successfully signed up" })
});

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let userExist = users.find(u => u.username === username && u.password === password);

    if (!userExist) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    const id = userExist.id;
    const token = jwt.sign({
        username,
        id
    }, "SecretKeyForTodoApp");
    res.json({ token });
});

app.post('/todo', authMiddleware, (req, res) => {
    const todo = req.body.todo;
    const userId = req.id

    let user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(401).json({ message: "Unauthorised access denied, login again!" })
    }

    let newTodo = {
        id: todoId++,
        todo: todo
    }
    todos.push(newTodo);
    user.todos.push(newTodo.id);

    res.status(201).json({ 
        message: "Todo Created Successfully!",
        todo: newTodo
     })
});

app.get('/todos', authMiddleware, (req, res) => {
    const userId = Number(req.id);
    let user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(401).json({ message: "Unauthorised access denied, login again!" });
    }
    //!my brute force thinking!! but it's wrong because res.json can't run in loop!!
    /*const uTodos = user.todos;
    for (let i = 0; i <= uTodos.length-1; i++) {
        let userTodo = todos.find(u => u.id === uTodos[i])
        res.json({ todo: userTodo.todo })
    }*/

    //! another approach that actually works!!
    /*const userTodos = user.todos.map(id => {
        return todos.find(t => t.id === id);
    });
    res.json({ todos: userTodos });*/

    // ? use of Map and Set would make things easier as they do not store duplicates

    //* just this one line is enough to do all the heavy lifting!!
    const userTodos = todos.filter(t => user.todos.includes(t.id));

    res.json({ todos: userTodos });
});

app.put('/username', authMiddleware, (req, res) => {
    const id = req.id;
    const newUserName = req.body.username;
    const user = users.find(u => u.id === id);
    const userNameExists = users.find(u => u.username === newUserName && u.id !== id)

    if (!user) {
        return res.status(401).json({ message: "Unauthorised access denied, login again!" });
    }

    if (userNameExists) {
        return res.status(403).json({ message: "username already exists, try different username!" })
    }
    user.username = newUserName;
    res.status(201).json({ message: "username updated",
        "updated user name": newUserName
     });
});

app.put('/todo', authMiddleware, (req, res) => {
    const todoid = Number(req.body.id);
    const updatedTodo = req.body.todo;
    const userid = Number(req.id);

    const usertodos = (users.find(u => u.id === userid)).todos;

    if (!usertodos.includes(todoid)) {
        return res.status(403).json({ message: "Unauthorized Access Denied!!" });
    }
    const exTodo = todos.find(t => t.id === todoid);
    exTodo.todo = updatedTodo;
    res.status(201).json({ message: "Todo updated successfully",
        "updated todo": exTodo
     });
});

app.delete('/todo', authMiddleware, (req, res) => {
    const userid = Number(req.id);
    const todoid = Number(req.body.id);

   const user = (users.find(u => u.id === userid));
   const usertodos = user.todos;

    if (!usertodos.includes(todoid)) {
        return res.status(403).json({ message: "Unauthorized Access Denied!!" });
    }

    todos = todos.filter(t => t.id !== todoid);
    user.todos = user.todos.filter(t => t !== todoid);

    res.status(200).json({ message: "Todo deleted successfully" });
});

app.delete('/user', authMiddleware, (req, res) => {
    const userid = Number(req.id);

    const user = users.find(u => u.id === userid);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // delete all todos belonging to this user
    todos = todos.filter(t => !user.todos.includes(t.id));

    // delete user
    users = users.filter(u => u.id !== userid);

    res.status(200).json({ message: "User and all associated todos deleted successfully" });
});

app.listen(3000);