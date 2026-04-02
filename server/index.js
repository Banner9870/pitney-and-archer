import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rssRouter from './routes/rss.js'

const app = express()
const PORT = process.env.PORT || 3001
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: ALLOWED_ORIGIN }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/rss', rssRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
