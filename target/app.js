const cors = require('cors')
const database = require('./services/database')
const express = require('express')
const logger = require('morgan')
const {
  Auth,
  Prometheus
} = require('avans-common')

const indexRouter = require('./routes/index')

const app = express()

database.initialize()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(Prometheus)
app.use(Auth(process.env.TARGET_API_KEY))

app.use('/', indexRouter)

module.exports = app
