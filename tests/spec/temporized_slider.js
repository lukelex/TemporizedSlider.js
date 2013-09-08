describe('TemporizedSlider', function () {
  var slides = [{
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

  var subject;

  beforeEach(function () {
    subject = TemporizedSlider;
  });

  describe('.setup', function () {
    beforeEach(function() {
      spyOn(subject, '$validateOptions');
      spyOn(subject, '$loadControls');
      spyOn(subject, '$loadGallery');
    });

    it('should trigger the beforeSetup callback', function () {
      var options = {
        slides: {},
        beforeSetup: jasmine.createSpy('beforeSetup')
      }

      subject.setup(options);

      expect(options.beforeSetup).toHaveBeenCalled();
    });

    it('should call loadControls', function () {
      var options = {
        slides: slides,
        controls: {
          load: true
        },
        gallery: {
          load: false
        }
      }

      subject.setup(options);

      expect(subject.$loadControls).toHaveBeenCalled();
    });

    it('should call trigger the afterSetup callback', function () {
      options = {
        slides: slides,
        afterSetup: jasmine.createSpy('afterSetup')
      }

      subject.setup(options);

      expect(options.afterSetup).toHaveBeenCalled();
    });

    it('should return the reference for the main object', function () {
      expect(subject.setup({slides: slides})).toEqual(subject);
    });
  });

  describe('.setupAndStart', function () {
    beforeEach(function () {
      spyOn(subject, 'setup').andReturn(subject);
      spyOn(subject, '$play');

      subject.setupAndStart();
    });

    it('should call setup method', function () {
      expect(subject.setup).toHaveBeenCalled();
    });

    it('should call play method', function () {
      expect(subject.$play).toHaveBeenCalled();
    });
  });

  describe('.$validateOptions', function() {
    it('should throw an exception if no options is provided', function () {
      expect(function () {
        subject.$validateOptions();
      }).toThrow();
    });

    it('should throw an exception if no slides is provided', function () {
      expect(function () {
        subject.setup({});
      }).toThrow();
    });
  });

  describe('.$mergeArgs', function () {
    it('should return the a merged object', function () {
      options         = {a: 'a'}
      defaultOptions  = {b: 'b'}

      expectedResult = {a: 'a', b: 'b'}

      result = subject.$mergeArgs(options, defaultOptions);

      expect(result).toEqual(expectedResult);
    });

    it('should not replace an existing property', function () {
      options         = {a: 'a'}
      defaultOptions  = {a: 'b'}

      expectedResult = {a: 'a'}

      result = subject.$mergeArgs(options, defaultOptions);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('.$setNextSlide', function () {
    beforeEach(function () {
      slider = {
        gallery: {load: true},
        nextSlide: jasmine.createSpy('nextSlide')
      };

      obj = {
        image: '',
        title: '',
        text: '',
      }

      slider.nextSlide.andReturn(obj);

      selectorDouble();

      spyOn(subject, '$getElement').andReturn(mockElm);
      spyOn(subject, '$markGalleryItemAsCurrent');
    });

    it('should set the html properties from the obj', function () {
      subject.$setNextSlide(slider);

      expect(subject.$getElement.calls.length).toEqual(3);
    });

    it('should trigger the afterChange callback', function () {
      slider.afterChange = jasmine.createSpy('callback');

      subject.$setNextSlide(slider);

      expect(slider.afterChange).toHaveBeenCalled();
    });
  });

  describe('.$getElement', function () {
    it('should forward to getElementById', function() {
      DOMHandler = selectorDouble();

      subject.$getElement('some-id', DOMHandler);

      expect(DOMHandler.getElementById).toHaveBeenCalled();
    });
  });

  describe('.$loadControls', function () {
    it('should not load the controls if not requested', function () {
      spyOn(subject, '$applyEventFor');

      subject.$loadControls({load: false});

      expect(subject.$applyEventFor).not.toHaveBeenCalled();
    });
  });

  describe('.$applyEventFor', function () {
    it('should attach the event handler', function () {
      selectorDouble();

      spyOn(subject, '$getElement').andReturn(mockElm);

      result = subject.$applyEventFor('myElm', function(){});

      expect(result).not.toBeUndefined();
    });
  });

  describe('.$clearTimer', function () {
    it('should clear the timer countdown', function () {
      clearFnc = jasmine.createSpy('clearTimeout');

      subject.$clearTimer(timeOut, clearFnc);

      expect(clearFnc).toHaveBeenCalledWith(timeOut);
    });
  });

  describe('.$pause', function () {
    var slider;

    beforeEach(function() {
      slider = {
        pause: function() {}
      }
    });

    it('should trigger the beforePause callback', function() {
      slider.beforePause = jasmine.createSpy('beforePause');

      subject.$pause(slider);

      expect(slider.beforePause).toHaveBeenCalled();
    });

    it('should clear the timer', function() {
      clearFnc = spyOn(subject, '$clearTimer');

      timeOut = 50;

      subject.$pause(slider);

      expect(clearFnc).toHaveBeenCalledWith(timeOut);
    });

    it('should not execute if slider is already paused', function() {
      clearFnc = spyOn(subject, '$clearTimer');

      slider.paused = true;

      subject.$pause(slider);

      expect(clearFnc).not.toHaveBeenCalled();
    });
  });

  describe('.play', function () {
    it('should forward to $play', function () {
      spyOn(subject, '$play');

      subject.play();

      expect(subject.$play).toHaveBeenCalled();
    });
  });

  describe('.pause', function () {
    it('should forward to $pause', function () {
      spyOn(subject, '$pause');

      subject.pause();

      expect(subject.$pause).toHaveBeenCalled();
    });
  });

  describe('.next', function () {
    it('should forward to $next', function () {
      spyOn(subject, '$next');

      subject.next();

      expect(subject.$next).toHaveBeenCalled();
    });
  });

  describe('.previous', function () {
    it('should forward to $previous', function () {
      spyOn(subject, '$previous');

      subject.previous();

      expect(subject.$previous).toHaveBeenCalled();
    });
  });

  describe('.$play', function() {
    beforeEach(function() {
      spyOn(subject, '$setNextSlide');
      spyOn(subject, '$scheduleNextChange');
      spyOn(subject, '$markGalleryItemAsCurrent');
    });

    it('should trigger the beforePlay callback', function() {
      var slider = {
        beforePlay: jasmine.createSpy('beforePlay'),
        paused: true,
        unpause: jasmine.createSpy('unpause'),
      };

      subject.$play(slider);

      expect(slider.beforePlay).toHaveBeenCalled();
    });

    it('should trigger the afterPlay callback', function() {
      var slider = {
        afterPlay: jasmine.createSpy('afterPlay'),
        paused: true,
        unpause: jasmine.createSpy('unpause'),
      };

      subject.$play(slider);

      expect(slider.afterPlay).toHaveBeenCalled();
    });
  });
});

describe('Slider', function() {
  beforeEach(function () {
    script = TemporizedSlider;
    subject = TemporizedSlider.Slider;
  });

  describe('#nextSlide', function() {
    it('should return the first slide when none is the current', function() {
      config = {
        slides: [{title: 'sample'}, {title: 'sample2'}]
      }

      slider = new script.Slider(config);

      expectedSlide = slider.slides[0];

      expect(slider.nextSlide()).toEqual(expectedSlide);
    });

    xit('should set the first slide as active', function() {
      config = {
        slides: [1,2]
      }

      slider = new script.Slider(config);

      slider.nextSlide();

      expectedSlide = slider.slides[1];

      expect(slider.nextSlide()).toEqual(expectedSlide);
    });
  });
});

describe('Slide', function() {
  describe('#nextSlide', function() {
    it('should be able to set the $next slide', function() {
      firstSlide = new TemporizedSlider.Slide({});
      secondSlide = new TemporizedSlider.Slide({}, firstSlide);

      expect(firstSlide.$next).toEqual(secondSlide);
    });
  });
});
