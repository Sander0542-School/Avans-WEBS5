const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
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

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
