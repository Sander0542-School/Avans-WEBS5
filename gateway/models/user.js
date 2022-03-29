const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isOwner: {
    type: Boolean,
    required: true,
    default: false
  }
})

module.exports = mongoose.model('User', schema)
