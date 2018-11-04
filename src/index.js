import bodyParser from 'body-parser'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.post('/', (req, res) => {
  res.send(
    Object.assign(req.body, { processed: true })
  )
})

app.get('/check', (req, res) => {
  res.send('')
})

app.listen(process.env.SERVER_BACKEND_PORT)
