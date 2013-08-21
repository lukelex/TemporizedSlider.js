describe('TemporizedSlider', function () {
  var data = [{
    image : 'https://www.google.com.br/images/srpr/logo3w.png',
    title : 'my title',
    text  : 'temporized text',
    time  : 18
  }];

  function selectorDouble () {
    var selector = {
      getElementById: function () {}
    }

    spyOn(selector, 'getElementById').andReturn(
      {
        onClick: undefined,
        src: undefined,
        innerHTML: undefined
      }
    );

    return selector;
  }

  var script = undefined;

  beforeEach(function () {
    script = TemporizedSlider;
  });

  describe('.setup', function () {
    it('should trigger the beforeSetup callback', function () {
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
    });

    it('should throw an exception if no options is provided', function () {
      expect(function () {
        script.setup();
      }).toThrow();
    });

    it('should throw an exception if no data is provided', function () {
      expect(function () {
        script.setup({});
      }).toThrow();
    });

    // it('should call trigger the afterSetup callback', function () {
    //   options = {
    //     data: data,
    //     afterSetup: function () {}
    //   }

    //   spyOn(options, 'afterSetup');

    //   script.setup(options);

    //   expect(options.afterSetup).toHaveBeenCalled();
    // });

    it('should return the reference for the main object', function () {
      spyOn(script, 'loadGallery');

      expect(script.setup({data: data})).toEqual(script);
    })
  });

  describe('.setupAndStart', function () {
    beforeEach(function () {
      spyOn(script, 'setup').andReturn(script);
      spyOn(script, 'play');

      script.setupAndStart();
    });

    it('should call setup method', function () {
      expect(script.setup).toHaveBeenCalled();
    });

    it('should call play method', function () {
      expect(script.play).toHaveBeenCalledWith(true);
    });
  });

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

      DOMHandler = selectorDouble();

      script.changeContent(obj, DOMHandler);
    });
  });

  describe('.loadControls', function () {
    it('should not load the controls if not requested', function () {
      spyOn(TemporizedSlider, 'applyEventFor');

      TemporizedSlider.loadControls({load: false});

      expect(TemporizedSlider.applyEventFor).not.toHaveBeenCalled();
    });
  });

  describe('.applyEventFor', function () {
    it('should attach the event handler', function () {
      DOMHandler = selectorDouble();

      result = TemporizedSlider.applyEventFor('myElm', function(){}, DOMHandler);

      expect(result).not.toBeUndefined();
    });
  });
});
