const cors = require('cors')
const consumer = require('./services/consumer')
const database = require('./services/database')
const express = require('express')
const logger = require('morgan')
const {
  Auth,
  Prometheus,
  RabbitMQ
} = require('avans-common')

const indexRouter = require('./routes/index')

const app = express()

database.initialize()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(Prometheus)
app.use(Auth(process.env.SUBMISSION_API_KEY))

RabbitMQ()
  .then(connection => {
    app.use('/', indexRouter(connection))
    consumer(connection)
  })

module.exports = app
