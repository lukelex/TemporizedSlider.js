describe('TemporizedSlider', function () {
  var data = [{
    image : 'https://www.google.com.br/images/srpr/logo3w.png',
    title : 'my title',
    text  : 'temporized text',
    time  : 18
  }];

  var mockElm = undefined

  function selectorDouble () {
    var selector = {
      getElementById: function () {}
    }

    mockElm = {
      onClick: undefined,
      src: undefined,
      innerHTML: undefined
    }

    spyOn(selector, 'getElementById').andReturn(mockElm);

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

      spyOn(script, '$loadControls');

      script.setup(options);

      expect(script.$loadControls).toHaveBeenCalled();
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
      spyOn(script, '$loadGallery');

      expect(script.setup({data: data})).toEqual(script);
    });
  });

  describe('.setupAndStart', function () {
    beforeEach(function () {
      spyOn(script, 'setup').andReturn(script);
      spyOn(script, '$play');

      script.setupAndStart();
    });

    it('should call setup method', function () {
      expect(script.setup).toHaveBeenCalled();
    });

    it('should call play method', function () {
      expect(script.$play).toHaveBeenCalledWith(true);
    });
  });

  describe('.$mergeArgs', function () {
    it('should return the a merged object', function () {
      options         = {a: 'a'}
      defaultOptions  = {b: 'b'}

      expectedResult = {a: 'a', b: 'b'}

      result = script.$mergeArgs(options, defaultOptions);

      expect(result).toEqual(expectedResult);
    });

    it('should not replace an existing property', function () {
      options         = {a: 'a'}
      defaultOptions  = {a: 'b'}

      expectedResult = {a: 'a'}

      result = script.$mergeArgs(options, defaultOptions);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('.$changeContent', function () {
    beforeEach(function () {
      obj = {
        image: '',
        title: '',
        text: ''
      }

      selectorDouble();

      spyOn(script, '$getElement').andReturn(mockElm);
    });

    it('should set the html properties from the obj', function () {
      console.log(script);
      script.$changeContent(obj, {});

      expect(script.$getElement.calls.length).toEqual(3);
    });

    it('should trigger the afterChange callback', function () {
      callback = jasmine.createSpy('callback')

      script.$changeContent(obj, {}, callback);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('.$getElement', function () {
    it('should forward to getElementById', function() {
      DOMHandler = selectorDouble();

      script.$getElement('some-id', DOMHandler);

      expect(DOMHandler.getElementById).toHaveBeenCalled();
    });
  });

  describe('.$loadControls', function () {
    it('should not load the controls if not requested', function () {
      spyOn(script, '$applyEventFor');

      script.$loadControls({load: false});

      expect(script.$applyEventFor).not.toHaveBeenCalled();
    });
  });

  describe('.$applyEventFor', function () {
    it('should attach the event handler', function () {
      selectorDouble();

      spyOn(script, '$getElement').andReturn(mockElm);

      result = script.$applyEventFor('myElm', function(){});

      expect(result).not.toBeUndefined();
    });
  });

  describe('.$clearTimer', function () {
    it('should clear the timer countdown', function () {
      clearFnc = jasmine.createSpy('clearTimeout');

      script.$clearTimer(timeOut, clearFnc);

      expect(clearFnc).toHaveBeenCalledWith(timeOut);
    });
  });

  describe('.$pause', function () {
    it('should trigger the beforePause callback', function() {
      callback = jasmine.createSpy('beforePause');

      script.$pause(false, 1, callback);

      expect(callback).toHaveBeenCalled();
    });

    it('should clear the timer', function() {
      clearFnc = spyOn(script, '$clearTimer');

      timeOut = 50;

      script.$pause(false, timeOut);

      expect(clearFnc).toHaveBeenCalledWith(timeOut);
    });

    it('should not execute if slider is already paused', function() {
      clearFnc = spyOn(script, '$clearTimer');

      script.$pause(true);

      expect(clearFnc).not.toHaveBeenCalled();
    });
  });

  describe('.play', function () {
    it('should forward to $play', function () {
      spyOn(script, '$play');

      script.play();

      expect(script.$play).toHaveBeenCalled();
    });
  });

  describe('.pause', function () {
    it('should forward to $pause', function () {
      spyOn(script, '$pause');

      script.pause();

      expect(script.$pause).toHaveBeenCalled();
    });
  });

  describe('.next', function () {
    it('should forward to $next', function () {
      spyOn(script, '$next');

      script.next();

      expect(script.$next).toHaveBeenCalled();
    });
  });

  describe('.previous', function () {
    it('should forward to $previous', function () {
      spyOn(script, '$previous');

      script.previous();

      expect(script.$previous).toHaveBeenCalled();
    });
  });

  describe('.$play', function() {
    it('should trigger the beforePlay callback', function() {
      var options = jasmine.createSpyObj(
        'options', ['beforePlay']
      )

      spyOn(TemporizedSlider, '$changeContent');
      spyOn(TemporizedSlider, '$scheduleNextChange');

      script.$play(true, options.beforePlay);

      expect(options.beforePlay).toHaveBeenCalled();
    });

    it('should trigger the afterPlay callback', function() {
      var options = jasmine.createSpyObj(
        'options', ['afterPlay']
      )

      spyOn(TemporizedSlider, '$changeContent');
      spyOn(TemporizedSlider, '$scheduleNextChange');

      script.$play(true, undefined, options.afterPlay);

      expect(options.afterPlay).toHaveBeenCalled();
    });
  });
});
