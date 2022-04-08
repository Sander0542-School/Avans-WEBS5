const createError = require('http-errors')
const express = require('express')
const parseDataUrl = require('parse-data-url')
const Target = require('../models/target')

function initialize (rabbitMqConnection) {
  const router = express.Router()

  let channel = null
  let queue = null

  rabbitMqConnection.createChannel()
    .then(value => {
      channel = value
      return channel.assertQueue('webs.tagger', { durable: true })
    })
    .then(value => {
      queue = value
    })

  router.post('/targets', function (req, res, next) {
    const target = new Target({
      userId: req.user.id,
      ...req.body
    })
    const error = target.validateSync()

    if (error) {
      res.status(400).json(error)
    } else {
      target.save()
        .then(() => {
          res.status(201).json(target)
          channel.sendToQueue(queue.queue, Buffer.from(JSON.stringify({
            sender: 'webs.target.tags',
            documentId: target._id.toString(),
            image: parseDataUrl(target.image).data
          })), {
            persistent: true
          })
        })
        .catch(error => {
          next(createError(500, error.message))
        })
    }
  })

  return router
}

module.exports = initialize
