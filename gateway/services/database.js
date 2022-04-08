const mongoose = require('mongoose')

class Database {
  static initialize () {
    mongoose.connect(process.env.GATEWAY_MONGO_URL)
      .then(() => {
        console.log('Connected to MongoDB')
      })
      .catch(error => {
        console.error(error)
      })
  }
}

module.exports = Database
