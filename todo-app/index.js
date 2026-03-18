// const express = require('express')
import express from 'express'
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile("[YOUR_PATH_FOR_INDEX.HTML]")
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

  res.json({ans: a/b})
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})