const createError = require('http-errors')
const express = require('express')
const parseDataUrl = require('parse-data-url')
const Submission = require('../models/submission')
const Target = require('../models/target')

function initialize (rabbitMqConnection) {
  const router = express.Router()

  let channel = null
  let taggerQueue = null
  let cqrsQueue = null

  rabbitMqConnection.createChannel()
    .then(async value => {
      channel = value
      taggerQueue = await channel.assertQueue('webs.tagger', { durable: true })
      cqrsQueue = await channel.assertQueue('webs.cqrs.submission', { durable: true })
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
          userId: req.user.id,
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
          channel.sendToQueue(taggerQueue.queue, Buffer.from(JSON.stringify({
            sender: 'webs.submission.tags',
            documentId: submission._id.toString(),
            image: parseDataUrl(submission.image).data
          })), {
            persistent: true
          })
        }
      })
      .catch(error => {
        next(createError(500, error.message))
      })
  })

  router.delete('/targets/:id/submissions/:submissionId', async function (req, res, next) {
    try {
      const target = await Target.findById(req.params.id)
      if (!target) {
        next(createError(404, 'Target not found'))
        return
      }

      const submission = await Submission.findById(req.params.submissionId).select('-image')
      if (!submission || submission.targetId.toString() !== target._id.toString()) {
        next(createError(404, 'Submission not found'))
        return
      }

      if (!(req.user.isOwner || req.user.id === submission.userId.toString() || req.user.id === target.userId.toString())) {
        next(createError(403, 'You are not allowed to delete this submission'))
        return
      }

      await submission.remove()
      res.status(202).json(submission)

      channel.sendToQueue(cqrsQueue.queue, Buffer.from(JSON.stringify({
        action: 'delete',
        id: submission._id.toString()
      })))
    } catch (error) {
      next(createError(500, error.message))
    }
  })

  return router
}

module.exports = initialize
