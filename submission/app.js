const cors = require('cors')
const express = require('express')
const logger = require('morgan')
const { Auth } = require('avans-common')

const indexRouter = require('./routes/index')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(Auth(process.env.SUBMISSION_API_KEY))

app.use('/', indexRouter)

module.exports = app
