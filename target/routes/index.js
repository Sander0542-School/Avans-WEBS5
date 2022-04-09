const createError = require('http-errors')
const express = require('express')
const parseDataUrl = require('parse-data-url')
const Target = require('../models/target')

function initialize (rabbitMqConnection) {
  const router = express.Router()

  let channel = null
  let taggerQueue = null
  let cqrsQueue = null
  let submissionQueue = null

  rabbitMqConnection.createChannel()
    .then(async value => {
      channel = value
      taggerQueue = await channel.assertQueue('webs.tagger', { durable: true })
      cqrsQueue = await channel.assertQueue('webs.cqrs.target', { durable: true })
      submissionQueue = await channel.assertQueue('webs.submission.target', { durable: true })
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
          channel.sendToQueue(taggerQueue.queue, Buffer.from(JSON.stringify({
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

  router.delete('/targets/:id', async function (req, res, next) {
    try {
      const target = await Target.findById(req.params.id)
      if (!target) {
        next(createError(404, 'Target not found'))
        return
      }

      if (!(req.user.isOwner || req.user.id === target.userId.toString())) {
        next(createError(403, 'You are not allowed to delete this target'))
        return
      }

      await target.remove()
      res.status(202).json(target)

      channel.sendToQueue(cqrsQueue.queue, Buffer.from(JSON.stringify({
        action: 'delete',
        id: target._id.toString()
      })))

      channel.sendToQueue(submissionQueue.queue, Buffer.from(JSON.stringify({
        action: 'delete',
        id: target._id.toString()
      })))
    } catch (error) {
      next(createError(500, error.message))
    }
  })

  return router
}

module.exports = initialize
