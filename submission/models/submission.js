const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: {
    type: mongoose.Schema.Types.Map,
    required: true,
    default: {}
  }
})

module.exports = mongoose.model('Submission', schema)
