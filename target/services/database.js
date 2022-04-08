const mongoose = require('mongoose')

class Database {
  static initialize () {
    mongoose.connect(process.env.TAGGER_MONGO_URL)
      .then(() => {
        console.log('Connected to MongoDB')
      })
      .catch(err => {
        console.error(err)
      })
  }
}

module.exports = Database
