const ConnectRoles = require('connect-roles')
const cors = require('cors')
const express = require('express')
const logger = require('morgan')

const database = require('./services/database')
const passport = require('./services/passport')

const authRouter = require('./routes/auth')
const indexRouter = require('./routes/index')
const errorRouter = require('./routes/errors')

const roles = new ConnectRoles()

const app = express()

database.initialize()

roles.use('owner', req => {
  if (req.user && roles.isAuthenticated()) {
    return req.user.isOwner === true
  }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(passport.initialize())
app.use(roles.middleware())

app.use('/', indexRouter(passport, roles))
app.use('/', authRouter)
app.use(errorRouter)

module.exports = app