/**
 * TemporizedSlider.js v2.1.1
 *
 * Copyright 2012, Lukas Alexandre
 * Licensed under MIT
 *
 * @module temporized_slider
*/

var TemporizedSlider;

(function() {
  TemporizedSlider = {
    // public facing methods
    setupAndStart: function(options) {
      TemporizedSlider.setup(options).play(TemporizedSlider.$slider);
    },
    play: function(slider) {
      (slider || TemporizedSlider.$slider).play();
    },
    pause: function(slider) {
      (slider || TemporizedSlider.$slider).pause();
    },
    next: function(slider) {
      (slider || TemporizedSlider.$slider).next();
    },
    previous: function(slider) {
      (slider || TemporizedSlider.$slider).previous();
    },
    setup: function(options) {
      TemporizedSlider.$validateOptions(options);

      var args = options;

      if (args.beforeSetup) args.beforeSetup();

      args = TemporizedSlider.$mergeArgs(
        args, TemporizedSlider.defaultArgs
      );

      args.controls = TemporizedSlider.$mergeArgs(
        args.controls, TemporizedSlider.defaultArgs.controls
      );

      var slider = TemporizedSlider.$slider =
        new TemporizedSlider.Slider(args);

      if (slider.controls.load)
        TemporizedSlider.$loadControls(slider);

      if (slider.gallery.load)
        TemporizedSlider.$loadGallery(slider);

      timeOut = null;

      if (slider.afterSetup) slider.afterSetup();

      return this;
    },
    // private methods
    $validateOptions: function(options) {
      if (!options)
        throw new Error('No options were provided');
      if (!options.slides)
        throw new Error('No slides were provided');
    },
    $mergeArgs: function (args, default_args) {
      for(var index in default_args) {
        if(!args[index])
          args[index] = default_args[index];
      }

      return args;
    },
    $getElement: function(id, DOMHandler) {
      if (!DOMHandler) DOMHandler = document;

      return DOMHandler.getElementById(id);
    },
    $applyEventFor: function (control) {
      var htmlElm = TemporizedSlider.$getElement(control.id);
      if (htmlElm) {
        htmlElm.onclick = control.handler;
        return htmlElm;
      }
    },
    $loadControls: function(slider) {
      if (!slider.controls.load) return slider;

      TemporizedSlider.$applyEventFor(slider.controls.play);

      TemporizedSlider.$applyEventFor(slider.controls.pause);

      TemporizedSlider.$applyEventFor(slider.controls.previous);

      TemporizedSlider.$applyEventFor(slider.controls.next);

      return slider;
    },
    $loadGallery: function(slider, DOMHandler) {
      if (!DOMHandler) DOMHandler = document;

      var imgUrl, title, container, galleryImgItem;
      var galleryElm = TemporizedSlider.$getElement(slider.gallery.id);

      var slides = slider.slides;

      for(var i in slides) {
        imgUrl = slides[i].image;
        imgTitle = slides[i].title;
        galleryElm.innerHTML += '<div class="gallery_item"><img class="gallery_img" src="' + imgUrl + '" alt="' + imgTitle + '" data-index="' + i + '" onclick="TemporizedSlider.GalleryItemClick(this)"/></div>';
        galleryImgs = DOMHandler.getElementsByClassName("gallery_img");
        galleryImgItem = galleryImgs[galleryImgs.length-1];
      };
    },
    $galleryItemClick: function(e, slider) {
      if (!slider) slider = TemporizedSlider.$slider;

      slider.$changeSlide();
      slider.$markGalleryItemAsCurrent(e);

      slider.pause();
    },
    defaultArgs: {
      default_time: 0,
      imageId: 'slider_image',
      titleId: 'slider_title',
      textId: 'slider_text',
      controls: {
        load: true,
        play: {
          id: 'play_control',
          handler: function() {
            TemporizedSlider.play
          }
        },
        pause: {
          id: 'pause_control',
          handler: function() {
            TemporizedSlider.pause();
          }
        },
        next: {
          id: 'next_control',
          handler: function() {
            TemporizedSlider.next();
          }
        },
        previous: {
          id: 'previous_control',
          handler: function() {
            TemporizedSlider.previous();
          }
        }
      },
      gallery : {
        load: true,
        id: 'slider_gallery'
      }
    }
  };

  TemporizedSlider.Slider = function(config) {
    var self = this;

    self.controls = config.controls;
    self.defaultTime = config.defaultTime;
    self.gallery = config.gallery;

    self.slides = []

    for (var i = 0; i < config.slides.length; i++) {
      self.slides.push(
        new TemporizedSlider.Slide(
          config.slides[i],
          self.slides[i-1]
        )
      );
    };

    self.imageId = config.imageId;
    self.textId = config.textId;
    self.titleId = config.titleId;

    self.afterSetup = config.afterSetup;

    self.paused = true;

    self.currentSlide = function() {
      if (self.current) return self.current;

      return {
        $next: self.slides[0]
      }
    };

    self.nextSlide = function() {
      return self.current = self.currentSlide().$next;
    };

    self.pause = function() {
      if (!self.paused) {
        if (self.beforePause) self.beforePause();

        self.paused = true;
      };

      self.$clearTimer(timeOut);
    };

    self.play = function() {
      if (self.paused) {
        if (self.beforePlay) self.beforePlay();

        self.paused = false;

        if (self.afterPlay) self.afterPlay();
      };
    };

    self.$next = function() {
      self.changeSlide(self.nextSlide());

      if (args.gallery.load)
        self.markGalleryItemAsCurrent(self.currentSlide());

      if(!self.paused)
        self.$scheduleNextChange();
    };

    self.$previous = function() {
      self.changeSlide(self.previousSlide());

      if (args.gallery.load)
        self.markGalleryItemAsCurrent(self.currentSlide());

      if(!paused)
        TemporizedSlider.$scheduleNextChange();
    };

    self.$scheduleNextChange = function() {
      TemporizedSlider.$clearTimer(timeOut);
      TemporizedSlider.$setTimer(
        'TemporizedSlider.$play()',
        self.currentSlide.time * 1000
      );
    };

    self.$clearTimer = function(timeOut, clearTimeoutFnc) {
      if (!clearTimeoutFnc) clearTimeoutFnc = clearTimeout;

      clearTimeoutFnc(timeOut);
    };

    self.$changeSlide = function(nextSlide) {
      TemporizedSlider.$getElement(self.imageId).src = nextSlide.image;
      TemporizedSlider.$getElement(self.titleId).innerHTML = nextSlide.title;
      TemporizedSlider.$getElement(self.textId).innerHTML = nextSlide.text;

      if (self.gallery.load)
        self.$markGalleryItemAsCurrent(nextSlide);

      if (self.afterChange)
        self.afterChange();
    };

    self.$markGalleryItemAsCurrent = function(elem) {
      var imgs = document.getElementsByClassName('gallery_img');
      for(var i in imgs) {
        if (typeof imgs[i] === 'object') {
          imgs[i].className = imgs[i].className.replace(' current', '');
        }
      }
      if (typeof elem === 'number')
        elem = imgs[elem];
      elem.className += ' current';
    };
  };

  TemporizedSlider.Slide = function(obj, previousSlide) {
    var self = this;

    self.image = obj.image;
    self.text = obj.text;
    self.time = obj.time;
    self.title = obj.title;

    self.$previous = previousSlide;
    if (self.$previous) self.$previous.$next = self;
  };
})();
