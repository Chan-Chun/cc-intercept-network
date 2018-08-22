class XHRRequest {
  constructor(xhr, method, url) {
    this._xhr = xhr
    this._method = method
    this._url = url
  }

  handleSend(data, cb) {
    if (cb && cb.send) {
      cb.send({
        url: this._url,
        method: this._method,
        data: data
      })
    }
  }

  handleHeadersReceived(cb) {
    const xhr = this._xhr
    const type = xhr.getResponseHeader('Content-Type')
    if (cb && cb.headerReceived) {
      cb.headerReceived({
        status: xhr.status,
        type: type,
        header: xhr.getAllResponseHeaders(),
        xhr: xhr
      })
    }
  }

  handleOver(cb) {
    const xhr = this._xhr
    if (cb && cb.send) {
      cb.over({
        status: xhr.status,
        url: this._url,
        method: this._method,
        resText: xhr.responseText,
        xhr: xhr
      })
    }
  }
}

module.exports = XHRRequest

