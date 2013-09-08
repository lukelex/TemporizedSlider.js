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
      TemporizedSlider.setup(options).$play(TemporizedSlider.$slider);
    },
    play: function() {
      TemporizedSlider.$play(TemporizedSlider.$slider);
    },
    pause: function() {
      TemporizedSlider.$pause(TemporizedSlider.$slider);
    },
    next: function() {
      TemporizedSlider.$next(TemporizedSlider.$slider);
    },
    previous: function() {
      TemporizedSlider.$previous(TemporizedSlider.$slider);
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
        TemporizedSlider.$loadControls(slider.controls);

      if (slider.gallery.load)
        TemporizedSlider.$loadGallery(slider.gallery, slider.slides);

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
    $clearTimer: function(timeOut, clearTimeoutFnc) {
      if (!clearTimeoutFnc) clearTimeoutFnc = clearTimeout;

      clearTimeoutFnc(timeOut);
    },
    $setNextSlide: function(slider) {
      nextSlide = slider.nextSlide();

      TemporizedSlider.$getElement(slider.imageId).src = nextSlide.image;
      TemporizedSlider.$getElement(slider.titleId).innerHTML = nextSlide.title;
      TemporizedSlider.$getElement(slider.textId).innerHTML = nextSlide.text;

      if (slider.gallery.load)
        TemporizedSlider.$markGalleryItemAsCurrent(slider);

      if (slider.afterChange) slider.afterChange();
    },
    $getElement: function(id, DOMHandler) {
      if (!DOMHandler) DOMHandler = document;

      return DOMHandler.getElementById(id);
    },
    $scheduleNextChange: function() {
      clearTimeout(timeOut);
      timeOut = setTimeout('TemporizedSlider.play(true)', collection[pointer].time * 1000);
    },
    $applyEventFor: function (id, event) {
      var htmlElm = TemporizedSlider.$getElement(id);
      if (htmlElm) {
        htmlElm.onclick = event;
        return htmlElm;
      }
    },
    $loadControls: function(controls) {
      if (!controls.load) return false;

      TemporizedSlider.$applyEventFor(
        controls.ids.play, controls.callbacks.play
      );

      TemporizedSlider.$applyEventFor(
        controls.ids.pause, controls.callbacks.pause
      );

      TemporizedSlider.$applyEventFor(
        controls.ids.previous, controls.callbacks.previous
      );

      TemporizedSlider.$applyEventFor(
        controls.ids.next, controls.callbacks.next
      );
    },
    $loadGallery: function(gallery, slides) {
      var galleryElm = TemporizedSlider.$getElement(gallery.id);
      var imgUrl, title, container, galleryImgItem;

      for(var i in slides) {
        imgUrl = args.data[i].image;
        imgTitle = args.data[i].title;
        galleryElm.innerHTML += '<div class="gallery_item"><img class="gallery_img" src="' + imgUrl + '" alt="' + imgTitle + '" data-index="' + i + '" onclick="TemporizedSlider.GalleryItemClick(this)"/></div>';
        galleryImgs = document.getElementsByClassName("gallery_img");
        galleryImgItem = galleryImgs[galleryImgs.length-1];
      };
    },
    $galleryItemClick: function(e) {
      TemporizedSlider.setNextSlide(slider);scheduleNextChange();
      TemporizedSlider.markGalleryItemAsCurrent(e);
    },
    $markGalleryItemAsCurrent: function(elem) {
      var imgs = document.getElementsByClassName('gallery_img');
      for(var i in imgs) {
        if (typeof imgs[i] === "object") {
          imgs[i].className = imgs[i].className.replace(' current', '');
        }
      }
      if (typeof elem === 'number') elem = imgs[elem];
      elem.className += ' current';
    },
    $play: function(slider) {
      if (slider.paused) {
        if (slider.beforePlay) slider.beforePlay();

        slider.unpause();

        TemporizedSlider.$setNextSlide(slider);

        if (slider.afterPlay) slider.afterPlay();

        TemporizedSlider.$scheduleNextChange();
      };
    },
    $pause: function(slider) {
      if (!slider.paused) {
        if (slider.beforePause) slider.beforePause();

        slider.pause();

        TemporizedSlider.$clearTimer(timeOut);
      }
    },
    $next: function() {
      pointer = (pointer + 1 <= end) ? (pointer + 1) : 0;

      TemporizedSlider.setNextSlide(slider);

      if (args.gallery.load)
        TemporizedSlider.markGalleryItemAsCurrent(pointer);

      if(!paused) TemporizedSlider.scheduleNextChange();
    },
    $previous: function() {
      pointer = (pointer - 1 >= 0) ? (pointer - 1) : end;

      var obj = collection[pointer];

      TemporizedSlider.setNextSlide(slider);

      if (args.gallery.load)
        TemporizedSlider.markGalleryItemAsCurrent(pointer);

      if(!paused)
        TemporizedSlider.scheduleNextChange();
    },
    defaultArgs: {
      default_time : 0,
      imageId : 'slider_image',
      titleId : 'slider_title',
      textId : 'slider_text',
      controls : {
        load : true,
        ids : {
          play : 'play_control',
          pause : 'pause_control',
          previous : 'previous_control',
          next : 'next_control'
        },
        callbacks : {
          play : function() {
            TemporizedSlider.play();
          },
          pause : function() {
            TemporizedSlider.pause();
          },
          previous : function() {
            TemporizedSlider.previous();
          },
          next : function() {
            TemporizedSlider.next();
          }
        }
      },
      gallery : {
        load : true,
        id : 'slider_gallery'
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
      self.pause = true;
    };

    self.unpause = function() {
      self.pause = false;
    }
  }

  TemporizedSlider.Slide = function(obj, previousSlide) {
    var self = this;

    self.image = obj.image;
    self.text = obj.text;
    self.time = obj.time;
    self.title = obj.title;

    self.$previous = previousSlide;
    if (self.$previous) self.$previous.$next = self;
  }
})();
