const axios = require('axios')
const FormData = require('form-data')

module.exports = class Imagga {
  constructor (apiKey) {
    this.apiKey = apiKey || process.env.TAGGER_IMAGGA_KEY
  }

  async tag (imageBase64) {
    const tags = {}
    try {
      const form = new FormData()
      form.append('image_base64', imageBase64)

      const uploadResponse = await axios.post('https://api.imagga.com/v2/uploads', form, {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
          ...form.getHeaders()
        }
      })

      const uploadId = uploadResponse.data.result.upload_id
      console.log(uploadId)

      const tagResponse = await axios.get(`https://api.imagga.com/v2/tags?image_upload_id=${uploadId}`, {
        headers: {
          Authorization: `Basic ${this.apiKey}`,
        }
      })

      tagResponse.data.result.tags.forEach(tag => {
        tags[tag.tag.en] = tag.confidence
      })
    } catch (err) {
      console.log(err)
    }

    return tags
  }

  formUrlEncoded (x) {
    return Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')
  }
}
