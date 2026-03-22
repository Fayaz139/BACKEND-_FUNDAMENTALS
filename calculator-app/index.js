// const express = require('express')
import express from 'express'
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile("/Users/sfayaz/100x/BACKEND-_FUNDAMENTALS/calculator-app/index.html")
})

app.use((req, res, next) => {
  const a = req.body.n1;
  const b = req.body.n2;

  if (
    n1 === undefined || n2 === undefined ||
    n1 === "" || n2 === "" ||
    isNaN(n1) || isNaN(n2)
  ) {
    next();
  } else {
      return res.status(400).json({
        error: "Enter the number to Calculate"
      })
  }
})

app.post('/sum', (req, res) => {
  const a = parseInt(req.body.n1);
  const b = parseInt(req.body.n2);

  res.json({ans: a+b})
})

app.post('/sub', (req, res) => {
  const a = parseInt(req.body.n1);
  const b = parseInt(req.body.n2);

  res.json({ans: a-b})
})

app.post('/mul', (req, res) => {
  const a = parseInt(req.body.n1);
  const b = parseInt(req.body.n2);

  res.json({ans: a*b})
})

app.post('/div', (req, res) => {
  const a = parseInt(req.body.n1);
  const b = parseInt(req.body.n2);

  res.json({ans:  a/b})
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})