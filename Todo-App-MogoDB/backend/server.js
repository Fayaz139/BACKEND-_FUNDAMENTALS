const express = require('express');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('./authMiddleware');
const mongoose = require('mongoose');
const { User } = require('../database/user.models');
const { Todo } = require('../database/todo.models');

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let userExist = await User.findOne({
        username: username
    })

    if (userExist) {
        return res.status(409).json({ message: "User already exists!" })
    }

    const newUser = await User.create({
        username,
        password
    });

    res.status(201).json({ message: "Successfully signed up", id: `${await newUser._id}` })
});

app.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let userExist = await User.findOne({
        username: username,
        password: password
    });

    if (!userExist) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    const id = userExist._id;
    const token = jwt.sign({
        id
    }, "SecretKeyForTodoApp");
    res.json({ token });
});

app.post('/todo', authMiddleware, async (req, res) => {
    const todo = req.body.todo;
    const userId = req.id

    const newTodo = await Todo.create({
        todo: todo,
        userId: userId
    });

    res.status(201).json({ 
        message: "Todo Created Successfully!",
        todo: newTodo
     })
});

app.get('/todos', authMiddleware, async (req, res) => {
    let todos = await Todo.find({ userId: req.id }).select("-userId");
    res.json({ todos });
});

app.put('/password', authMiddleware, async (req, res) => {
    const id = req.id;
    const newPassword = req.body.password;
    const user = await User.findByIdAndUpdate(
        id, 
        { password: newPassword },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated" });
});

app.put('/todo', authMiddleware, async (req, res) => {
    const todoid = req.body.id;
    const newTodo = req.body.todo;

    const updatedTodo = await Todo.findOneAndUpdate(
        {
            _id: todoid,
            userId: req.id
        },
        { todo: newTodo },
        { new: true }
    );

    if (!updatedTodo) {
        return res.status(403).json({ message: "Unauthorized Access Denied!!" });
    }

    res.status(200).json(
        { 
            message: "Todo updated successfully",
            updatedTodo 
        }
    );
});

app.delete('/todo', authMiddleware, async (req, res) => {
    const userid = req.id
    const todoid = req.body.id

   const deletedTodo = await Todo.findOneAndDelete(
    {
        _id: todoid,
        userId: userid
    }
   );

    if (!deletedTodo) {
        return res.status(403).json({ message: "Unauthorized Access Denied!!" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
});

app.delete('/user', authMiddleware, async (req, res) => {
    const userid = req.id;

    await Todo.deleteMany({ userId: userid });
    const deletedUser = await User.findByIdAndDelete(userid);

    if (!deletedUser) {
        return res.status(404).json({ message: "User not found or already deleted" });
    }

    res.status(200).json({ message: "User and all associated todos deleted successfully" });
});

mongoose.set('bufferCommands', false);
mongoose.connect("Your DB Connection Link")
.then(() => { 
    console.log("✅ DB CONNECTED");
    app.listen(3000, () => console.log("🚀 Server started"));
})
.catch((err) => {
    console.log("❌ DB Connection Error:", err.message);
});



