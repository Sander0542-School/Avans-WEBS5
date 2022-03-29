const mongoose = require('mongoose')

class Database {
  static initialize () {
    mongoose.connect(process.env.GATEWAY_MONGO_URL)
  }
}

module.exports = Database
