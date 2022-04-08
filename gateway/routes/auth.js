const bcrypt = require('bcrypt')
const createError = require('http-errors')
const express = require('express')
const jwt = require('../services/token')
const mongoose = require('mongoose')
const User = require('../models/user')

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

router.post('/register', async function (req, res, next) {
  try {
    const user = new User({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      isOwner: req.body.isOwner
    })

    const error = user.validateSync()
    if (error) {
      res.status(400).json(error)
      return
    }

    await user.save()

    res.json(tokenResponse(generateToken(user)))
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json(error)
      return
    }
    console.error(error)
    next(createError(500, error.message))
  }
})

router.post('/login', async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      next(createError(401, 'Invalid email or password'))
      return
    }

    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) {
      next(createError(401, 'Invalid email or password'))
      return
    }

    res.json(tokenResponse(generateToken(user)))
  } catch (error) {
    console.error(error)
    next(createError(500, error.message))
  }
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
