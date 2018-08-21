'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetchRequest = function () {
  function FetchRequest(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, FetchRequest);

    if (url instanceof window.Request) {
      url = url.url;
    }
    this._url = url;
    this._options = options;
    this._method = this._options.method = options.method || 'GET';
  }

  _createClass(FetchRequest, [{
    key: 'send',
    value: function send(fetchResult, cb, requestInfo) {
      var _this = this;

      var options = this._options;
      var data = typeof options.body === 'string' ? options.body : '';
      fetchResult.then(function (res) {
        res = res.clone();
        cb(res, {
          requestInfo: requestInfo,
          options: _this._options
        });
        return res;
      });
    }
  }]);

  return FetchRequest;
}();

var XHRRequest = function () {
  function XHRRequest(xhr, method, url) {
    _classCallCheck(this, XHRRequest);

    this._xhr = xhr;
    this._method = method;
    this._url = url;
  }

  _createClass(XHRRequest, [{
    key: 'handleSend',
    value: function handleSend(data, cb) {
      if (cb && cb.send) {
        cb.send({
          url: this._url,
          method: this._method,
          data: data
        });
      }
    }
  }, {
    key: 'handleHeadersReceived',
    value: function handleHeadersReceived(cb) {
      var xhr = this._xhr;
      var type = xhr.getResponseHeader('Content-Type');
      if (cb && cb.headerReceived) {
        cb.headerReceived({
          status: xhr.status,
          type: type,
          header: xhr.getAllResponseHeaders(),
          xhr: xhr
        });
      }
    }
  }, {
    key: 'handleOver',
    value: function handleOver(cb) {
      var xhr = this._xhr;
      if (cb && cb.send) {
        cb.over({
          status: xhr.status,
          url: this._url,
          method: this._method,
          resText: xhr.responseText,
          xhr: xhr
        });
      }
    }
  }]);

  return XHRRequest;
}();

var hookFetch = function hookFetch(cb) {
  var origFetch = window.fetch;
  window.fetch = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var req = new (Function.prototype.bind.apply(FetchRequest, [null].concat(args)))();
    var fetchResult = origFetch.apply(undefined, args);
    var requestInfo = JSON.stringify(args);
    req.send(fetchResult, cb, requestInfo);
    return fetchResult;
  };
};

var hookXHR = function hookXHR(cb) {
  var winXhr = window.XMLHttpRequest.prototype;
  var origSend = winXhr.send;
  var origOpen = winXhr.open;
  var req = null;
  winXhr.open = function (method, url) {
    var xhr = this;
    req = new XHRRequest(xhr, method, url);
    xhr.addEventListener('readystatechange', function () {
      switch (xhr.readyState) {
        case 2:
          {
            return req.handleHeadersReceived(cb);
          }
        case 4:
          {
            return req.handleOver(cb);
          }
      }
    });
    origOpen.apply(this, arguments);
  };

  winXhr.send = function (data) {
    if (req) {
      req.handleSend(data, cb);
    }
    origSend.apply(this, arguments);
  };
};
