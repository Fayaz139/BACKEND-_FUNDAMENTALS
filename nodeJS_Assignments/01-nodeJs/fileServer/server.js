const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const directory = path.join(__dirname, 'files')

app.get('/files', (req, res) => {
    fs.readdir(directory, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Directory not found" });
        } else {
            res.status(200).json(data)
        }
    })
})

app.get('/files/:file', (req, res) => {
    const filePath = path.join(directory, req.params.file);
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: "File not found" });
        } else {
            res.status(200).send(data)
        }
    })
})

app.use((req, res, next) => {
    res.status(404).json('Route not found');
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})