class FetchRequest {
  constructor (url, options = {}) {
    if (url instanceof window.Request){
      url = url.url
    }
    this._url = url
    this._options = options
    this._method = this._options.method = options.method || 'GET'
  }
  send (fetchResult, cb, requestInfo) {
    const options = this._options
    const data = typeof options.body === 'string' ? options.body : ''
    fetchResult.then(res => {
      res = res.clone()
      cb(res, {
        requestInfo: requestInfo,
        options: this._options
      })
      return res
    })
  }
}

module.exports = FetchRequest
