const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./authMiddleware" );

const app = express();

app.use(express.json());

let todos = [];
let users = [];

app.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let userExist = users.find(u => (u.username === username));

    if (userExist) {
        return res.status(403).json({
            message: "User with this username already exists"
        })
    } 
    users.push({username, password})

    res.json({
        message: "You have signed up"
    })

});

app.post('/signin', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const userExist = users.find(u => (u.username === username && u.password === password));

    if (!userExist) {
        return res.status(403).json({ "message": "Invalid Credentials" });
    }

    const token = jwt.sign({
        username
    }, "secret key for this todo-App");
    res.json({ token })
});

app.get('/todos', authMiddleware, (req, res) => {
    let username = req.username;

    let userTodos = todos.filter(t => t.username === username);
    
    res.json({
        "todos": userTodos
    })
})

app.post('/todos', authMiddleware, (req, res) => {
    let username = req.username;
    let todo = req.body.todo;

    todos.push({ username, todo});

    res.json({ message: "TODO added successfully!" })
})

app.get('/', (req, res) => {
    res.sendFile("/Users/sfayaz/100x/BACKEND-_FUNDAMENTALS/Auth-Todo-App/Frontend/index.html");
});

app.get('/signup', (req, res) => {
    res.sendFile("/Users/sfayaz/100x/BACKEND-_FUNDAMENTALS/Auth-Todo-App/Frontend/signup.html")
});

app.get('/signin', (req, res) => {
    res.sendFile("/Users/sfayaz/100x/BACKEND-_FUNDAMENTALS/Auth-Todo-App/Frontend/signin.html")
});

app.listen(3000);