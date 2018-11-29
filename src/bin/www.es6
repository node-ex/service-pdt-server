if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development'
}

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const config = require('../config/default.es6')

const app = require('../app.es6')
const http = require('http')

app.set('port', config.port)

const server = http.createServer(app)

server.listen(config.port)
