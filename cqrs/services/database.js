const mongoose = require('mongoose')

class Database {
  static initialize () {
    mongoose.connect(process.env.CQRS_MONGO_URL)
  }
}

module.exports = Database
