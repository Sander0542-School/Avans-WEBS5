const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  hash: {
    type: String,
    required: true
  },
  tags: {
    type: mongoose.Schema.Types.Map,
    required: true
  }
})

module.exports = mongoose.model('Tag', schema)
