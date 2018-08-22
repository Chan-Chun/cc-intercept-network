describe('test hook', function () {
  it('hookXHR should be ok', function () {
    chai.assert.deepEqual(window.hookXHRRes, window.normalXHRRes)
  })
  it('hookFetch should be ok', function () {
    chai.assert.deepEqual(window.hookFetchRes, window.normalFetchRes)
  })
})
