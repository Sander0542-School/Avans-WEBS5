const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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
    required: true
  },
  score: {
    type: Number,
    required: true
  }
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Submission', schema)
