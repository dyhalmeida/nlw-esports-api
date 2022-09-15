import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()


app.get('/games', async (req, res) => {

  try {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            ads: true
          }
        }
      }
    })
    return res.status(200).json(games)
  } catch (error) {
    return res.status(404).json([])
  }

})

app.post('/ads', (req, res) => {
  return res.status(201).json([])
})


app.get('/games/:id/ads', (req, res) => {
  return res.status(201).json([])
})

app.get('/ads/:id/discord', (req, res) => {
  return res.status(201).json([])
})

app.get('/ads', (req, res) => {
  res.json({
    message: 'Hello'
  })
})

app.listen(3333)