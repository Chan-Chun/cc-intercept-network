const XHRRequest = require('./xhr-request')
const FetchRequest = require('./fetch-request')

const hookFetch = cb => {
  const origFetch = window.fetch
  window.fetch = function (...args) {
    const req = new FetchRequest(...args)
    const fetchResult = origFetch(...args)
    const requestInfo = JSON.stringify(args)
    req.send(fetchResult, cb, requestInfo)
    return fetchResult
  }
}

const hookXHR = cb => {
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

module.exports = {
  hookXHR,
  hookFetch
}
