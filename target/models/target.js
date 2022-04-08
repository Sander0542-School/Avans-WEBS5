const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('Target', schema)
