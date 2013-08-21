describe('TemporizedSlider', function () {
  var data = [{
    image : 'https://www.google.com.br/images/srpr/logo3w.png',
    title : 'my title',
    text  : 'temporized text',
    time  : 18
  }];

  describe('.setup', function () {
    it('should call trigger the beforeSetup callback', function () {
      var options = jasmine.createSpyObj(
        'options', ['beforeSetup']
      )

      options.data = {}

      TemporizedSlider.setup(options);

      expect(options.beforeSetup).toHaveBeenCalled();
    });

    it('should call loadControls', function () {
      var options = {
        data: data,
        controls: {
          load: true
        },
        gallery: {
          load: false
        }
      }

      spyOn(TemporizedSlider, 'loadControls');

      TemporizedSlider.setup(options);

      expect(TemporizedSlider.loadControls).toHaveBeenCalled();
    })

    it('should throw an exception if no options is provided', function () {
      expect(function () {
        TemporizedSlider.setup()
      }).toThrow();
    })

    it('should throw an exception if no data is provided', function () {
      expect(function () {
        TemporizedSlider.setup({})
      }).toThrow();
    })

    // it('should call trigger the afterSetup callback', function () {
    //   options = {
    //     data: '',
    //     afterSetup: function () {}
    //   }

    //   spyOn(options, 'afterSetup');

    //   TemporizedSlider.setup(options);

    //   expect(options.afterSetup).toHaveBeenCalled();
    // });
  });

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
  });

  describe('.changeContent', function () {
    it('should set the html properties from the obj', function () {
      obj = {
        image: '',
        title: '',
        text: ''
      }
      DOMHandler = {
        getElementById: function () {}
      }

      spyOn(DOMHandler, 'getElementById').andReturn({
        src: undefined,
        innerHTML: undefined,
      })

      TemporizedSlider.changeContent(obj, DOMHandler);
    })
  })
});
