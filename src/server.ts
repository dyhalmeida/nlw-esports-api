import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import { hoursStringToMinutes } from './utils/hoursStringToMinutes'
import { minutesToHoursString } from './utils/minutesToHoursString'

const app = express()
app.use(express.json())
app.use(cors())
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

app.post('/games/:id/ads', async (req, res) => {
  const id = Number(req.params.id)
  const body = req.body
  try {
    const ad = await prisma.ad.create({
      data: {
        gameId: id,
        name: body.name,
        yearsPlaying: body.yearsPlaying,
        discord: body.discord,
        weekDays: body.weekDays.join(','),
        hourStart: hoursStringToMinutes(body.hourStart),
        hourEnd: hoursStringToMinutes(body.hourEnd),
        useVoiceChannel: body.useVoiceChannel
      }
    })
    return res.status(201).json(ad)
  } catch (error) {
    return res.status(500).send()
  }
})


app.get('/games/:id/ads', async (req, res) => {

  const id = Number(req.params.id)

  try {
    const ads = await prisma.ad.findMany({
      select: {
        id: true,
        name: true,
        weekDays: true,
        useVoiceChannel: true,
        yearsPlaying: true,
        hourStart: true,
        hourEnd: true
      },
      where: {
        gameId: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    if (ads.length) {
      return res.status(200).json(ads.map(ad => {
        return {
          ...ad,
          weekDays: ad.weekDays.split(','),
          hourStart: minutesToHoursString(ad.hourStart),
          hourEnd: minutesToHoursString(ad.hourEnd),
        }
      }))
    }
    return res.status(404).json([])
  } catch (error) {
    return res.status(500).send()
  }
})

app.get('/ads/:id/discord', async (req, res) => {

  const id = Number(req.params.id)

  try {
    
    const discord = await prisma.ad.findUnique({
      select: {
        discord: true
      },
      where: {
        id
      }
    })
    if (discord) {
      return res.status(200).json(discord)
    }
    return res.status(404).send()
  } catch (error) {
    return res.status(500).send()
  }
})

app.listen(3333)