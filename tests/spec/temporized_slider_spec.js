var DOM, subject, mockElm;

function DOMDouble () {
  mockElm = {
    onClick: undefined,
    src: undefined,
    innerHTML: undefined
  }

  spyOn(TemporizedSlider.DOM, '$getElementById').andReturn(mockElm);

  return TemporizedSlider.DOM;
}

describe('TemporizedSlider', function () {
  var slides = [{
    image : 'https://www.google.com.br/images/srpr/logo3w.png',
    title : 'my title',
    text  : 'temporized text',
    time  : 18
  }];

  beforeEach(function () {
    subject = TemporizedSlider;
    DOM = undefined;
  });

  describe('.setupAndStart', function () {
    beforeEach(function () {
      spyOn(subject, 'setup').andReturn(subject);
      spyOn(subject, 'play');

      subject.setupAndStart();
    });

    it('should call setup method', function () {
      expect(subject.setup).toHaveBeenCalled();
    });

    it('should call play method', function () {
      expect(subject.play).toHaveBeenCalled();
    });
  });

  describe('.play', function () {
    it('should forward to slider play', function () {
      var slider = jasmine.createSpyObj('slider', ['play']);

      subject.play(slider);

      expect(slider.play).toHaveBeenCalled();
    });
  });

  describe('.next', function () {
    it('should forward to slider next', function () {
      var slider = jasmine.createSpyObj('slider', ['next']);

      subject.next(slider);

      expect(slider.next).toHaveBeenCalled();
    });
  });

  describe('.previous', function () {
    it('should forward to slider previous', function () {
      var slider = jasmine.createSpyObj('slider', ['previous']);

      subject.previous(slider);

      expect(slider.previous).toHaveBeenCalled();
    });
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

    it('should call $loadControls', function () {
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

  describe('.$applyEventFor', function () {
    it('should attach the event handler', function () {
      DOM = DOMDouble();

      control = {
        id: 'elmId',
        handler: function() {}
      }

      result = subject.$applyEventFor(control, DOM);

      expect(result).not.toBeUndefined();
    });
  });

  describe('.$loadControls', function () {
    it('should not load the controls if not requested', function () {
      spyOn(subject, '$applyEventFor');

      slider = {
        controls: {
          load: false
        }
      };

      subject.$loadControls(slider);

      expect(subject.$applyEventFor).not.toHaveBeenCalled();
    });

    it('should return slider instance when done', function() {
      spyOn(subject, '$applyEventFor');

      slider = {
        controls: {
          load: true
        }
      };

      expect(subject.$loadControls(slider)).
        toEqual(slider);
    });

    it('should return slider instance even when not loading controls', function() {
      spyOn(subject, '$applyEventFor');

      slider = {
        controls: {
          load: false
        }
      };

      expect(subject.$loadControls(slider)).
        toEqual(slider);
    });

    var slider;
    beforeEach(function() {
      slider = {
        controls: {
          load: true,
          play: {
            id: 'playId',
            handler: function() {}
          },
          pause: {
            id: 'pauseId',
            handler: function() {}
          },
          next: {
            id: 'nextId',
            handler: function() {}
          },
          previous: {
            id: 'previousId',
            handler: function() {}
          }
        }
      };

      DOM = DOMDouble();
    });

    it('should call .$applyEventFor with play config', function () {
      spyOn(subject, '$applyEventFor');

      subject.$loadControls(slider);

      expect(subject.$applyEventFor).
        toHaveBeenCalledWith(slider.controls.play, DOM);
    });

    it('should call .$applyEventFor with pause config', function () {
      spyOn(subject, '$applyEventFor');

      subject.$loadControls(slider);

      expect(subject.$applyEventFor).
        toHaveBeenCalledWith(slider.controls.pause, DOM);
    });

    it('should call .$applyEventFor with next config', function () {
      spyOn(subject, '$applyEventFor');

      subject.$loadControls(slider);

      expect(subject.$applyEventFor).
        toHaveBeenCalledWith(slider.controls.next, DOM);
    });

    it('should call .$applyEventFor with previous config', function () {
      spyOn(subject, '$applyEventFor');

      subject.$loadControls(slider);

      expect(subject.$applyEventFor).
        toHaveBeenCalledWith(slider.controls.previous, DOM);
    });
  });

  describe('.$galleryItemClick', function() {
    var HTMLElm;

    beforeEach(function() {
      slider = jasmine.createSpyObj('slider',
        ['$changeSlide', 'pause', '$markGalleryItemAsCurrent']
      );

      slider.slides = [1,2,3];

      HTMLElm = jasmine.createSpyObj('HTMLElm', ['getAttribute']);
      HTMLElm.getAttribute.andReturn(0);
    });

    it('should call $changeSlide', function() {
      subject.$galleryItemClick(HTMLElm, slider);

      expect(slider.$changeSlide).toHaveBeenCalled();
    });

    it('should call $markGalleryItemAsCurrent', function() {
      subject.$galleryItemClick(HTMLElm, slider);

      expect(slider.$markGalleryItemAsCurrent).
        toHaveBeenCalledWith(HTMLElm);
    });

    it('should pause the slider', function() {
      subject.$galleryItemClick(HTMLElm, slider);

      expect(slider.pause).toHaveBeenCalled();
    });
  });
});

describe('DOM', function() {
  var documentDouble;

  beforeEach(function() {
    subject = TemporizedSlider.DOM;

    documentDouble = jasmine.createSpyObj(
      'documentDouble',
      [
        'getElementById',
        'getElementsWithClass',
        'getElementsByClassName'
      ]
    );
  });

  describe('#$getElementById', function () {
    it('should forward to getElementById', function() {
      elmId = 'some-id';

      subject.$getElementById(elmId, documentDouble);

      expect(documentDouble.getElementById).
        toHaveBeenCalledWith(elmId);
    });
  });

  describe('#$getElementsByClassName', function () {
    it('should forward to getElementsByClassName', function() {
      elmClass = 'some-class';

      subject.$getElementsByClassName(elmId, documentDouble);

      expect(documentDouble.getElementsByClassName).
        toHaveBeenCalledWith(elmId);
    });
  });

  describe('#$getElementsWithClass', function () {
    it('should forward to getElementsWithClass', function() {
      elmClass = 'some-class';

      subject.$getElementsWithClass(elmId, documentDouble);

      expect(documentDouble.getElementsWithClass).
        toHaveBeenCalledWith(elmId);
    });
  });
});

describe('Slider', function() {
  var sampleConfig;

  beforeEach(function () {
    script = TemporizedSlider;
    sampleConfig = {
      slides: [1,2,3,4,5]
    };
    DOM = DOMDouble();
    subject = new TemporizedSlider.Slider(
      sampleConfig, DOM
    );
  });

  describe('#currentSlide', function() {
    it('should return the first slide when none is the current', function() {
      expectedSlide = subject.slides[0];

      expect(subject.currentSlide()).toEqual(expectedSlide);
    });
  });

  describe('#nextSlide', function() {
    it('should call #currentSlide', function() {
      spyOn(subject, 'currentSlide').andReturn({});

      subject.nextSlide();

      expect(subject.currentSlide).toHaveBeenCalled();
    });

    it('should return the $next property from the #currentSlide return', function() {
      expectedSlide = subject.slides[0];

      spyOn(subject, 'currentSlide').
        andReturn({$next: expectedSlide});

      expect(subject.nextSlide()).toEqual(expectedSlide);
    });

    it('should set the first slide as active', function() {
      subject.nextSlide();

      expectedSlide = subject.slides[1];

      spyOn(subject, 'currentSlide').
        andReturn({$next: expectedSlide});

      expect(subject.nextSlide()).toEqual(expectedSlide);
    });

    it('should return the first slide if the last is the current', function() {
      expectedSlide = subject.slides[0];

      spyOn(subject, 'currentSlide').
        andReturn(subject.slides[subject.slides.length-1]);

      expect(subject.nextSlide()).toEqual(expectedSlide);
    });
  });

  describe('previousSlide', function() {
    it('should call #currentSlide', function() {
      spyOn(subject, 'currentSlide').andReturn({});

      subject.previousSlide();

      expect(subject.currentSlide).toHaveBeenCalled();
    })

    it('should return the last slide if the first is the current', function() {
      expectedSlide = subject.slides[subject.slides.length-1];

      spyOn(subject, 'currentSlide').
        andReturn(subject.slides[0]);

      expect(subject.previousSlide()).toEqual(expectedSlide);
    });
  });

  describe('#play', function() {
    beforeEach(function(){
      spyOn(subject, 'currentSlide');
      spyOn(subject, '$changeSlide');
      spyOn(subject, '$scheduleNextChange');
    });

    it('should call #$changeSlide', function() {
      var newSlide = {};

      subject.currentSlide.andReturn(newSlide);

      subject.play();

      expect(subject.$changeSlide).
        toHaveBeenCalledWith(newSlide);
    });

    it('should call #$scheduleNextChange', function() {
      subject.play();

      expect(subject.$scheduleNextChange).
        toHaveBeenCalled();
    });

    it('should trigger the beforePlay callback', function() {
      subject.beforePlay = jasmine.createSpy('beforePlay');

      subject.paused = true;
      subject.play();

      expect(subject.beforePlay).toHaveBeenCalled();
    });

    it('should trigger the afterPlay callback', function() {
      subject.afterPlay = jasmine.createSpy('afterPlay');

      subject.paused = true;
      subject.play();

      expect(subject.afterPlay).toHaveBeenCalled();
    });
  });

  describe('#pause', function(){
    it('should trigger the beforePause callback', function() {
      subject.beforePause = jasmine.createSpy('beforePause');

      spyOn(subject, '$clearTimer');

      subject.paused = false;
      subject.pause();

      expect(subject.beforePause).toHaveBeenCalled();
    });

    it('should clear the timer', function() {
      clearFnc = spyOn(subject, '$clearTimer');

      timeOut = 50;

      subject.pause();

      expect(clearFnc).toHaveBeenCalledWith(timeOut);
    });

    it('should not execute if slider is already paused', function() {
      subject.pause();
      subject.pause();

      expect(clearFnc.calls.length).toEqual(1);
    });

    it('should not execute the beforePause callback if paused', function() {
      subject.beforePause = jasmine.createSpy('beforePause');

      subject.paused = true;
      subject.pause();

      expect(subject.beforePause).not.toHaveBeenCalled();
    });
  });

  describe('#$next', function() {
    beforeEach(function() {
      spyOn(subject, 'nextSlide');
      spyOn(subject, '$changeSlide');
      spyOn(subject, '$scheduleNextChange');
      subject.gallery = {};
    });

    it('should call #nextSlide', function() {
      subject.$next();

      expect(subject.nextSlide).toHaveBeenCalled();
    });

    it('should call #$changeSlide', function() {
      mockSlide = {}

      subject.nextSlide.andReturn(mockSlide);

      subject.$next();

      expect(subject.$changeSlide).
        toHaveBeenCalledWith(mockSlide);
    });

    it('should call #$scheduleNextChange', function() {
      subject.paused = false;

      subject.$next();

      expect(subject.$scheduleNextChange).toHaveBeenCalled();
    });
  });

  describe('#$scheduleNextChange', function() {

  });

  describe('#$clearTimer', function () {
    it('should clear the timer countdown', function () {
      clearFnc = jasmine.createSpy('clearTimeout');

      subject.$clearTimer(timeOut, clearFnc);

      expect(clearFnc).toHaveBeenCalledWith(timeOut);
    });
  });

  describe('#$changeSlide', function () {
    beforeEach(function () {
      subject.gallery = {load: true};

      spyOn(subject, '$markGalleryItemAsCurrent');

      nextSlide = {
        image: '',
        title: '',
        text: '',
      };
    });

    it('should set the html properties from the obj', function () {
      subject.$changeSlide(nextSlide);

      expect(DOM.$getElementById.calls.length).toEqual(3);
    });

    it('should call the .$markGalleryItemAsCurrent', function() {
      subject.$changeSlide(nextSlide);

      expect(subject.$markGalleryItemAsCurrent).
        toHaveBeenCalledWith(nextSlide);
    });

    it('should trigger the afterChange callback', function () {
      subject.afterChange = jasmine.createSpy('callback');

      subject.$changeSlide(nextSlide);

      expect(subject.afterChange).toHaveBeenCalled();
    });
  });
});

describe('Slide', function() {
  describe('#$next', function() {
    it('should be able to set the $next slide', function() {
      firstSlide = new TemporizedSlider.Slide({});
      secondSlide = new TemporizedSlider.Slide({}, firstSlide);

      expect(firstSlide.$next).toEqual(secondSlide);
    });
  });
});
