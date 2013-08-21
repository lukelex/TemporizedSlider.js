describe('TemporizedSlider', function () {
  describe('.init', function () {
    it('should call trigger the beforeInit callback', function () {
      options = {
        beforeInit: function () {}
      }

      spyOn(options, 'beforeInit');

      TemporizedSlider.init(options);

      expect(options.beforeInit).toHaveBeenCalled();
    })
  })

  describe('.mergeArgs', function () {
    it('should return the a merged object', function () {
      options         = {a: 'a'}
      defaultOptions  = {b: 'b'}

      expectedResult = {a: 'a', b: 'b'}

      result = TemporizedSlider.mergeArgs(options, defaultOptions);

      expect(result).toEqual(expectedResult);
    });

    it('should not replace an existing property', function () {
      options         = {a: 'a'}
      defaultOptions  = {a: 'b'}

      expectedResult = {a: 'a'}

      result = TemporizedSlider.mergeArgs(options, defaultOptions);

      expect(result).toEqual(expectedResult);
    });
  })
})