const assert = require('assert')
const { hookXHR, hookFetch } = require('../../lib/cc-intercept-network')

var wd = require('macaca-wd')

var remoteConfig = {
  host: 'localhost',
  port: 3456
};

var driver = wd.promiseChainRemote(remoteConfig)


describe('intercept-network-test', () => {
  before(function() {
    return driver.init({
      platformName: 'desktop',
      browserName: 'Electron'
    })
  })

  after(function() {
    return driver
      .sleep(1000)
      .quit()
  })
  it('hookXHR', () => {
    return driver
      .sleep(1000)
      .execute(`
        hookXHR({
          send: (...args) => {
            console.log(args)
          },
          headerReceived: (...args) => {
            console.log(args)
          },
          over: (...args) => {
            console.log(args)
          }
        })
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://www.alipay.com')
        xhr.send()
      `)
  })
})

