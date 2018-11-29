// Setup
const config = require('./config/default.es6')

// Built-in packages
const path = require('path')

// Third-party packages
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')

// Routes
const viewRouter = require('./routes/view.es6')
const secretRouter = require('./routes/secret.es6')
const dataRouter = require('./routes/data.es6')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  prefix: '/public',
  indentedSyntax: false,
  sourceMap: config.sourceMaps
}))

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/secret', secretRouter)
app.use('/data', dataRouter)
app.use('/', viewRouter)

module.exports = app
