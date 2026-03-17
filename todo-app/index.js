// const express = require('express')
import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/fayaz', (req, res) => {
  res.json({query : 'Hello World im Fayaz'})
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})