const mongoose = require('mongoose')

const targetSchema = new mongoose.Schema({
  content: { type: String },
  ratings: [{
    userId: { type: String },
    vote: { type: Boolean }
  }],
  place: {
    type: String,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  submissions: [{
    userId: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    tags: {
      type: mongoose.Schema.Types.Map,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }]
})

module.exports = mongoose.model('Target', targetSchema)
