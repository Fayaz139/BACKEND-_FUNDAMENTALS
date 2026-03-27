const express = require('express');
const app = express();
app.use(express.json());
let users =[];

function generateId() {
    if(users.length === 0) return 1;
    // let maxId = users[0].id
    // for (let i = 1; i <= users.length-1; i++) {
    //     if (users[i].id > maxId) {
    //         maxId = users[i].id;
    //     }
    // }
    // return maxId+1;
    return Math.max(...users.map(u => u.id))+1;
}

app.post('/signup', (req, res) => {
    let user = req.body;
    let userExists = false;
    for (let i = 0; i <= users.length-1; i++) {
        if (users[i].username === user.username) {
            userExists = true;
            break;
        }
    }
    if (!userExists) {
        user.id = generateId();
        users.push(user);
        res.status(201).json({ message: 'user created', user: user });
    } else {
        res.status(400).json({ message: "username already exists" })
    }
})

app.post('/login', (req, res) => {
    let user = req.body;
    let userFound = null;
        for (let i = 0; i <= users.length-1; i++) {
            if (users[i].username === user.username && users[i].password === user.password) {
                userFound = users[i];
                break;
            }
        }
    if (userFound) {
        res.status(200).json({
            userName: userFound.username,
            firstName: userFound.firstName,
            lastName: userFound.lastName
        })
    } else {
        res.status(401).json({ message: 'invalid credintials' })
    }
})

app.get('/data', (req, res) => {
    let uName = req.headers.username;
    let uPass = req.headers.password;
    let userFound = false;
        for (let i = 0; i <= users.length-1; i++) {
            if (users[i].username === uName && users[i].password === uPass) {
                userFound = true;
                break;
            }
        }
    if (userFound) {
        res.status(200).json({ users: users.map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName
        })) })
    } else {
        res.status(401).json({ message: "Unauthorized access denied" })
    }
})

app.listen(3000, () => {
    console.log("Hi")
});