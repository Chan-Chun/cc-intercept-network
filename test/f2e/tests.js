describe('test hook', function () {
  it('hookXHR should be ok', function () {
    chai.assert.strictEqual(window.hookRes, window.normalRes)
  });
});
