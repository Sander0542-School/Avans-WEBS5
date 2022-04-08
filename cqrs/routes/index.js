const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const Submission = require('../models/submission')
const Target = require('../models/target')

router.get('/targets', async function (req, res, next) {
  const page = req.query.page || 0

  Target.paginate({}, {
    page: page,
    limit: 10,
    customLabels: {
      docs: 'targets'
    }
  })
    .then(result => {
      res.json(result)
    })
    .catch(error => {
      next(createError(500, error.message))
    })
})

router.get('/targets/:id', async function (req, res, next) {
  Target.findById(req.params.id)
    .then(target => {
      if (!target) {
        next(createError(404, 'Target not found'))
      } else {
        res.json(target)
      }
    })
    .catch(error => {
      next(createError(500, error.message))
    })
})

router.get('/targets/:id/image', async function (req, res, next) {
  Target.findById(req.params.id)
    .select('image')
    .then(target => {
      if (!target) {
        next(createError(404, 'Target not found'))
      } else {
        res.send(target.image)
      }
    })
    .catch(error => {
      next(createError(500, error.message))
    })
})

router.get('/targets/:id/submissions', async function (req, res, next) {
  const page = req.query.page || 0

  Target.findById(req.params.id)
    .then(target => {
      if (!target) {
        next(createError(404, 'Target not found'))
      } else {
        return Submission.paginate({
          targetId: target._id
        }, {
          page: page,
          limit: 10,
          customLabels: {
            docs: 'submissions'
          }
        })
      }
    })
    .then(result => {
      res.json(result)
    })
    .catch(error => {
      next(createError(500, error.message))
    })
})

router.get('/targets/:id/submissions/:submissionId', async function (req, res, next) {
  Target.findById(req.params.id)
    .then(target => {
      if (!target) {
        next(createError(404, 'Target not found'))
      } else {
        return Submission.findById(req.params.submissionId)
      }
    })
    .then(submission => {
      if (!submission) {
        next(createError(404, 'Submission not found'))
      } else {
        res.json(submission)
      }
    })
    .catch(error => {
      next(createError(500, error.message))
    })
})

router.get('/targets/:id/submissions/:submissionId/image', async function (req, res, next) {
  Target.findById(req.params.id)
    .then(target => {
      if (!target) {
        next(createError(404, 'Target not found'))
      } else {
        return Submission.findById(req.params.submissionId).select('image')
      }
    })
    .then(submission => {
      if (!submission) {
        next(createError(404, 'Submission not found'))
      } else {
        res.send(submission.image)
      }
    })
    .catch(error => {
      next(createError(500, error.message))
    })
})

module.exports = router
