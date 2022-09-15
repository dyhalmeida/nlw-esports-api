import express from 'express'

const app = express()

app.get('/ads', (req, res) => {
  res.json({
    message: 'Hello'
  })
})

app.listen(3333)