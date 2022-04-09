const mongoose = require('mongoose')
const validDataUrl = require('valid-data-url')
const validCoords = require('is-valid-coordinates')

const schema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    maxLength: 256
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return validDataUrl(v)
      },
      message: props => `${props.value} is not a valid base64 image`
    }
  },
  tags: {
    type: mongoose.Schema.Types.Map,
    required: true,
    default: {}
  },
  ratings: {
    type: mongoose.Schema.Types.Map,
    required: true,
    default: {}
  },
  place: {
    type: String,
    required: true,
    maxLength: 64
  },
  lat: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return validCoords.latitude(v)
      },
      message: props => `${props.value} is not a valid lat`
    }
  },
  long: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return validCoords.longitude(v)
      },
      message: props => `${props.value} is not a valid long`
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = mongoose.model('Target', schema)
