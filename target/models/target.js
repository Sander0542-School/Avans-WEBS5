const mongoose = require('mongoose')
const validDataUrl = require('valid-data-url')

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
    required: true,
    maxLength: 64,
  },
  lat: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/.test(v)
      },
      message: props => `${props.value} is not a valid lat`
    }
  },
  long: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^-?((1?[1-7][1-9]|[1-9]?[0-9])\.{1}\d{1,6}|180\.{1}0{1,6})$/.test(v)
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
