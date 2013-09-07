/**
 * TemporizedSlider.js v2.1.0
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

      if (slider.controls && slider.controls.load)
        TemporizedSlider.$loadControls(slider.controls);

      if (slider.gallery && slider.gallery.load)
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
    }
  };

  TemporizedSlider.Slider = function(config) {
    this.controls = config.controls;
    this.slides = config.slides;
    this.defaultTime = config.defaultTime;
    this.gallery = config.gallery;

    this.imageId = config.imageId;
    this.textId = config.textId;
    this.titleId = config.titleId;

    this.afterSetup = config.afterSetup;

    this.paused = true;

    this.nextSlide = function() {
      alert(123);
    };

    this.pause = function() {
      this.pause = true
    }
  }

  TemporizedSlider.$previous = function() {
    pointer = (pointer - 1 >= 0) ? (pointer - 1) : end;

    var obj = collection[pointer];

    TemporizedSlider.setNextSlide(slider);

    if (args.gallery.load)
      TemporizedSlider.markGalleryItemAsCurrent(pointer);

    if(!paused)
      TemporizedSlider.scheduleNextChange();
  };

  TemporizedSlider.$next = function() {
    pointer = (pointer + 1 <= end) ? (pointer + 1) : 0;

    TemporizedSlider.setNextSlide(slider);

    if (args.gallery.load)
      TemporizedSlider.markGalleryItemAsCurrent(pointer);

    if(!paused) TemporizedSlider.scheduleNextChange();
  };

  TemporizedSlider.$setNextSlide = function(slider) {
    nextSlide = slider.nextSlide();

    TemporizedSlider.$getElement(slider.imageId).src = nextSlide.image;
    TemporizedSlider.$getElement(slider.titleId).innerHTML = nextSlide.title;
    TemporizedSlider.$getElement(slider.textId).innerHTML = nextSlide.text;

    if (slider.gallery.load)
      TemporizedSlider.$markGalleryItemAsCurrent(slider);

    if (slider.afterChange) slider.afterChange();
  };

  TemporizedSlider.$getElement = function(id, DOMHandler) {
    if (!DOMHandler) DOMHandler = document;

    return DOMHandler.getElementById(id);
  };

  TemporizedSlider.$scheduleNextChange = function() {
    clearTimeout(timeOut);
    timeOut = setTimeout('TemporizedSlider.play(true)', collection[pointer].time * 1000);
  };

  TemporizedSlider.$applyEventFor = function (id, event) {
    var htmlElm = TemporizedSlider.$getElement(id);
    if (htmlElm) {
      htmlElm.onclick = event;
      return htmlElm;
    }
  }

  TemporizedSlider.$loadControls = function(controls) {
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
  };

  TemporizedSlider.$loadGallery = function(gallery, slides) {
    var galleryElm = TemporizedSlider.$getElement(gallery.id);
    var imgUrl, title, container, galleryImgItem;

    for(var i in slides) {
      imgUrl = args.data[i].image;
      imgTitle = args.data[i].title;
      galleryElm.innerHTML += '<div class="gallery_item"><img class="gallery_img" src="' + imgUrl + '" alt="' + imgTitle + '" data-index="' + i + '" onclick="TemporizedSlider.GalleryItemClick(this)"/></div>';
      galleryImgs = document.getElementsByClassName("gallery_img");
      galleryImgItem = galleryImgs[galleryImgs.length-1];
    };
  };

  TemporizedSlider.$galleryItemClick = function(e) {
    TemporizedSlider.setNextSlide(slider);scheduleNextChange();
    TemporizedSlider.markGalleryItemAsCurrent(e);
  }

  TemporizedSlider.$markGalleryItemAsCurrent = function(elem) {
    var imgs = document.getElementsByClassName('gallery_img');
    for(var i in imgs) {
      if (typeof imgs[i] === "object") {
        imgs[i].className = imgs[i].className.replace(' current', '');
      }
    }
    if (typeof elem === 'number') elem = imgs[elem];
    elem.className += ' current';
  };

  TemporizedSlider.defaultArgs = {
    default_time : 0,
    image_id : 'slider_image',
    title_id : 'slider_title',
    text_id : 'slider_text',
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
      id : "slider_gallery"
    }
  };
})();
