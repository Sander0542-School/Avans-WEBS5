const cors = require('cors')
const express = require('express')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const errorRouter = require('./routes/errors');

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use(errorRouter)

module.exports = app
