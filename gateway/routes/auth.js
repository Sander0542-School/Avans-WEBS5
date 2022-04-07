const express = require('express')
const User = require('../models/user')
const jwt = require('../services/token')
const createError = require('http-errors')

const router = express.Router()

router.get('/register', function (req, res) {
  res.json({
    email: 'Your email',
    password: 'Your password',
    isOwner: 'Whether you are an owner'
  })
})

router.get('/login', function (req, res) {
  res.json({
    email: 'Your email',
    password: 'Your password'
  })
})

router.post('/register', function (req, res, next) {
  if (req.body.email === undefined || req.body.password === undefined) {
    next(createError(400))
    return
  }

  User.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (user) {
        next(createError(400, 'Email already taken'))
      } else {
        const newUser = new User(req.body)
        return newUser.save()
      }
    })
    .then(user => {
      if (user) {
        res.json(tokenResponse(generateToken(user)))
      }
    })
    .catch(reason => {
      next(createError(500, reason.message))
    })
})

router.post('/login', function (req, res, next) {
  if (req.body.email === undefined || req.body.password === undefined) {
    next(createError(400))
    return
  }

  User.findOne({
    email: req.body.email,
    password: req.body.password
  })
    .exec()
    .then(user => {
      if (user) {
        res.json(tokenResponse(generateToken(user)))
      } else {
        next(createError(403, 'Invalid credentials'))
      }
    })
    .catch(reason => {
      next(createError(500, reason.message))
    })
})

function generateToken (user) {
  const payload = {
    email: user.email
  }
  const options = {
    subject: user._id.toString(),
    expiresIn: '1h'
  }
  return jwt.sign(payload, options)
}

function tokenResponse (token) {
  return {
    token
  }
}

module.exports = router
