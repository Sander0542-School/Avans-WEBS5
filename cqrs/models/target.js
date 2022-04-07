const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  ratings: [{
    userId: {
      type: String,
      required: true
    },
    vote: {
      type: Boolean,
      required: true
    }
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
  }
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Target', schema)
