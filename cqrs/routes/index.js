const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const Submission = require('../models/submission')
const Target = require('../models/target')

router.get('/targets', async function (req, res, next) {
  try {
    const page = req.query.page || 0
    const sort = req.query.sort ? `field ${req.query.sort}` : undefined
    const query = req.query.place ? { place: req.query.place } : {}

    const targets = await Target.paginate(query, {
      page: page,
      sort: sort,
      limit: 10,
      customLabels: {
        docs: 'targets'
      }
    })

    res.json(targets)
  } catch (error) {
    next(createError(500, error.message))
  }
})

router.get('/targets/:id', async function (req, res, next) {
  try {
    const target = await Target.findById(req.params.id)

    if (!target) {
      next(createError(404, 'Target not found'))
      return
    }

    res.json(target)
  } catch (error) {
    next(createError(500, error.message))
  }
})

router.get('/targets/:id/image', async function (req, res, next) {
  try {
    const target = await Target.findById(req.params.id).select('image')

    if (!target) {
      next(createError(404, 'Target not found'))
      return
    }

    res.send(target.image)
  } catch (error) {
    next(createError(500, error.message))
  }
})

router.get('/targets/:id/ratings', async function (req, res, next) {
  try {
    const target = await Target.findById(req.params.id).select('ratings')

    if (!target) {
      next(createError(404, 'Target not found'))
      return
    }

    res.json(target.ratings)
  } catch (error) {
    next(createError(500, error.message))
  }
})

router.get('/targets/:id/submissions', async function (req, res, next) {
  try {
    const target = await Target.findById(req.params.id)

    if (!target) {
      next(createError(404, 'Target not found'))
      return
    }

    const page = req.query.page || 0
    const sort = req.query.sort ? `field ${req.query.sort}` : undefined
    const query = req.query.user ? { userId: req.query.user } : {}

    const submissions = await Submission.paginate({
      targetId: target._id,
      ...query
    }, {
      page: page,
      limit: 10,
      customLabels: {
        docs: 'submissions'
      }
    })

    res.json(submissions)
  } catch (error) {
    next(createError(500, error.message))
  }
})

router.get('/targets/:id/submissions/:submissionId', async function (req, res, next) {
  try {
    const target = await Target.findById(req.params.id)

    if (!target) {
      next(createError(404, 'Target not found'))
      return
    }

    const submission = await Submission.findById(req.params.submissionId)

    if (!submission) {
      next(createError(404, 'Submission not found'))
      return
    }

    res.json(submission)
  } catch (error) {
    next(createError(500, error.message))
  }
})

router.get('/targets/:id/submissions/:submissionId/image', async function (req, res, next) {
  try {
    const target = await Target.findById(req.params.id)

    if (!target) {
      next(createError(404, 'Target not found'))
      return
    }

    const submission = await Submission.findById(req.params.submissionId).select('image targetId')

    if (!submission || submission.targetId !== target._id) {
      next(createError(404, 'Submission not found'))
      return
    }

    res.send(submission.image)
  } catch (error) {
    next(createError(500, error.message))
  }
})

module.exports = router
