const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    default: false
  }
})

module.exports = mongoose.model('Tag', schema)
