const cors = require('cors')
const express = require('express')
const logger = require('morgan')
const {
  Auth,
  Errors,
  Prometheus
} = require('avans-common')

const indexRouter = require('./routes/index')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(Prometheus)
app.use(Auth(process.env.CQRS_API_KEY))

app.use('/', indexRouter)

app.use(Errors)

module.exports = app
