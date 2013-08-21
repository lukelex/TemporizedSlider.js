describe('TemporizedSlider', function () {
  var data = [{
    image : 'https://www.google.com.br/images/srpr/logo3w.png',
    title : 'my title',
    text  : 'temporized text',
    time  : 18
  }];

  var script = undefined;

  beforeEach(function () {
    script = TemporizedSlider;
  })

  describe('.setup', function () {
    it('should call trigger the beforeSetup callback', function () {
      var options = jasmine.createSpyObj(
        'options', ['beforeSetup']
      )

      options.data = {}

      script.setup(options);

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

      spyOn(script, 'loadControls');

      script.setup(options);

      expect(script.loadControls).toHaveBeenCalled();
    })

    it('should throw an exception if no options is provided', function () {
      expect(function () {
        script.setup()
      }).toThrow();
    })

    it('should throw an exception if no data is provided', function () {
      expect(function () {
        script.setup({})
      }).toThrow();
    })

    // it('should call trigger the afterSetup callback', function () {
    //   options = {
    //     data: '',
    //     afterSetup: function () {}
    //   }

    //   spyOn(options, 'afterSetup');

    //   script.setup(options);

    //   expect(options.afterSetup).toHaveBeenCalled();
    // });
  });

  describe('.setupAndStart', function () {
    beforeEach(function () {
      spyOn(script, 'setup')
      spyOn(script, 'play')
    });

    it('should call setup method', function () {
      script.setupAndStart();

      expect(script.setup).toHaveBeenCalled()
    })

    it('should call play method', function () {
      script.setupAndStart();

      expect(script.play).toHaveBeenCalled()
    })
  })

  describe('.mergeArgs', function () {
    it('should return the a merged object', function () {
      options         = {a: 'a'}
      defaultOptions  = {b: 'b'}

      expectedResult = {a: 'a', b: 'b'}

      result = script.mergeArgs(options, defaultOptions);

      expect(result).toEqual(expectedResult);
    });

    it('should not replace an existing property', function () {
      options         = {a: 'a'}
      defaultOptions  = {a: 'b'}

      expectedResult = {a: 'a'}

      result = script.mergeArgs(options, defaultOptions);

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

      script.changeContent(obj, DOMHandler);
    })
  })
});
