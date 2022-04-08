const createError = require('http-errors')
const express = require('express')
const parseDataUrl = require('parse-data-url')
const Target = require('../models/target')
const Submission = require('../models/submission')

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

  router.post('/targets/:id/submissions', function (req, res, next) {
    Target.findById(req.params.id)
      .then(target => {
        if (!target) {
          next(createError(404, 'Target not found'))
          return
        }

        const submission = new Submission({
          targetId: target._id,
          userId: req.user.userId,
          ...req.body
        })
        const error = submission.validateSync()

        if (error) {
          res.status(400).json(error)
        } else {
          return submission.save()
        }
      })
      .then(submission => {
        if (submission) {
          res.status(201).json(submission)
          channel.sendToQueue(queue.queue, Buffer.from(JSON.stringify({
            sender: 'webs.submission.tags',
            documentId: submission._id.toString(),
            image: parseDataUrl(submission.image).data
          })), {
            persistent: true
          })
        }
      })
      .catch((error) => {
        next(createError(500, error.message))
      })
  })

  return router
}

module.exports = initialize
