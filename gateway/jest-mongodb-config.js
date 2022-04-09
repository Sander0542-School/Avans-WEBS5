module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true
    },
    autoStart: false,
    instance: {}
  },
  mongoURLEnvName: 'GATEWAY_MONGO_URL'
}
