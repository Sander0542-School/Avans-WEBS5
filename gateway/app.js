const ConnectRoles = require('connect-roles')
const cors = require('cors')
const express = require('express')
const proxy = require('express-http-proxy')
const logger = require('morgan')
const {
  Errors,
  Prometheus
} = require('avans-common')

const database = require('./services/database')
const passport = require('./services/passport')

const authRouter = require('./routes/auth')
const cqrsRouter = require('./routes/cqrs')
const indexRouter = require('./routes/index')
const submissionRouter = require('./routes/submission')
const targetRouter = require('./routes/target')

const roles = new ConnectRoles()

const app = express()

database.initialize()

roles.use('owner', req => {
  if (req.user && roles.isAuthenticated()) {
    return req.user.isOwner === true
  }
})

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(logger('dev'))
app.use(passport.initialize())
app.use(roles.middleware())

app.use('/grafana', proxy('http://grafana:3000/', {
  preserveHostHdr: true
}))
app.use('/prometheus', proxy('http://prometheus:9090/'))

app.use(Prometheus)
app.use('/', authRouter)
app.use('/', indexRouter(passport, roles))
app.use('/', cqrsRouter(passport))
app.use('/', submissionRouter(passport))
app.use('/', targetRouter(passport))

app.use(Errors)

module.exports = app
