const mongoose = require('mongoose')
const validDataUrl = require('valid-data-url')

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
  }
})

module.exports = mongoose.model('Submission', schema)
