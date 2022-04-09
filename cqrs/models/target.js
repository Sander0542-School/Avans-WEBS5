const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    select: false
  },
  tags: {
    type: mongoose.Schema.Types.Map,
    required: true
  },
  ratings: {
    type: mongoose.Schema.Types.Map,
    required: true,
    default: {}
  },
  place: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  long: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Target', schema)
