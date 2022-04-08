const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tags: {
    type: mongoose.Schema.Types.Map,
    required: true
  }
})

module.exports = mongoose.model('Tag', schema)
