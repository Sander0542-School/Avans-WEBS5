const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.GATEWAY_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let dbConnection

module.exports = {
  client: client,
  getDb: async function () {
    return new Promise((resolve, reject) => {
      if (!dbConnection) {
        console.log(`Opening connection: ${process.env.GATEWAY_MONGO_URL}`)
        client.connect(function (err, db) {
          if (err || !db) {
            reject(err)
          }

          dbConnection = db.db(process.env.GATEWAY_DB_NAME ?? 'users')
          console.log('Successfully connected to MongoDB.')

          resolve(dbConnection)
        })
      } else {
        resolve(dbConnection)
      }
    })
  }
}
