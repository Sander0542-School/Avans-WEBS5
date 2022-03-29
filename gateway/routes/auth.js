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
    .then(value => {
      if (value) {
        next(createError(400, 'Email already taken'))
      } else {
        const user = new User(req.body)
        user.save()
          .then(value => {
            res.json(tokenResponse(generateToken(value)))
          }).catch(reason => {
          next(createError(500, reason.message))
        })
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
    .then(value => {
      if (value) {
        res.json(tokenResponse(generateToken(value)))
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
