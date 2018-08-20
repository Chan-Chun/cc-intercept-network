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

const hookFetch = (cb) => {
  const origFetch = window.fetch
  window.fetch = function (...args) {
    const req = new FetchRequest(...args)
    const fetchResult = origFetch(...args)
    const requestInfo = JSON.stringify(args)
    req.send(fetchResult, cb, requestInfo)
    return fetchResult
  }
}

const hookXHR = (cb) => {
  const winXhr = window.XMLHttpRequest.prototype
  const origSend = winXhr.send
  const origOpen = winXhr.open
  let req = null
  winXhr.open = function(method, url) {
    let xhr = this
    req = new XHRRequest(xhr, method, url)
    xhr.addEventListener('readystatechange', function() {
      switch (xhr.readyState) {
        case 2: {
          return req.handleHeadersReceived(cb)
        }
        case 4: {
          return req.handleOver(cb)
        }
      }
    })
    origOpen.apply(this, arguments)
  }

  winXhr.send = function(data) {
    if (req) {
      req.handleSend(data, cb)
    }
    origSend.apply(this, arguments)
  }
}
