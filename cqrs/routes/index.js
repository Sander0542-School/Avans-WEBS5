const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const Submission = require('../models/submission')
const Target = require('../models/target')

router.get('/targets', function (req, res, next) {
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
    .catch(err => {
      next(createError(500, err.message))
    })
})

router.get('/targets/:id', function (req, res, next) {
  Target.findById(req.params.id)
    .then(target => {
      if (!target) {
        next(createError(404, 'Target not found'))
      } else {
        res.json(target)
      }
    })
    .catch(err => {
      next(createError(500, err.message))
    })
})

router.get('/targets/:id/submissions', function (req, res, next) {
  const page = req.query.page || 0

  Target.findById(req.params.id)
    .then(target => {
      if (!target) {
        next(createError(404, 'Target not found'))
      } else {
        return Submission.paginate({
          target: target._id
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
    .catch(err => {
      next(createError(500, err.message))
    })
})

router.get('/target/:id/submissions/:submissionId', function (req, res, next) {
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
    .catch(err => {
      next(createError(500, err.message))
    })
})

module.exports = router
