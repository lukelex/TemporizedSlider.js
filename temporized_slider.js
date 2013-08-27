/**
 * TemporizedSlider.js v2.1.0
 *
 * Copyright 2012, Lukas Alexandre
 * Licensed under MIT
 *
 * @module temporized_slider
*/

var TemporizedSlider = {};

(function() {
  TemporizedSlider.setup = function(options) {
    TemporizedSlider.validateOptions(options);

    var args = options;

    if (args.beforeSetup != null) args.beforeSetup();

    args = TemporizedSlider.mergeArgs(
      args, TemporizedSlider.defaultArgs
    );

    args.controls = TemporizedSlider.mergeArgs(
      args.controls, TemporizedSlider.defaultArgs.controls
    );

    TemporizedSlider.loadControls(options.controls);
    TemporizedSlider.loadGallery(args, options.gallery);

    collection = options.data;

    pointer = -1;
    end = collection.length - 1;
    timeOut = null;
    paused = false;

    if (args.afterSetup != null) args.afterSetup();

    return this;
  };

  TemporizedSlider.setupAndStart = function (options) {
    TemporizedSlider.setup(options).play(true);
  }

  TemporizedSlider.validateOptions = function (options) {
    if (!options) throw new Error('No options provided');
    if (!options.data)
      throw new Error('No data provided');
  }

  TemporizedSlider.mergeArgs = function (args, default_args) {
    for(var index in default_args) {
      if(!args[index])
        args[index] = default_args[index];
    }

    return args;
  }

  TemporizedSlider.play = function(force_play) {
    if (paused || force_play) {
      if (args.beforePlay != null) args.beforePlay();

      paused = false;
      pointer = (pointer + 1 > end) ? 0 : (pointer + 1);

      TemporizedSlider.changeContent();

      if (args.gallery.load)
        TemporizedSlider.markGalleryItemAsCurrent(pointer);

      TemporizedSlider.scheduleNextChange();
    }
  };

  TemporizedSlider.pause = function() {
    if (!paused) {
      if (args.beforePause != null) args.beforePause();

      paused = true;

      TemporizedSlider.clearTimer(timeOut);

      pointer = (pointer - 1 < 0) ? 0 : (pointer - 1);
    }
  };

  TemporizedSlider.previous = function() {
    pointer = (pointer - 1 >= 0) ? (pointer - 1) : end;

    var obj = collection[pointer];

    TemporizedSlider.changeContent(obj);

    if (args.gallery.load)
      TemporizedSlider.markGalleryItemAsCurrent(pointer);

    if(!paused)
      TemporizedSlider.scheduleNextChange();
  };

  TemporizedSlider.next = function() {
    pointer = (pointer + 1 <= end) ? (pointer + 1) : 0;

    TemporizedSlider.changeContent();

    if (args.gallery.load)
      TemporizedSlider.markGalleryItemAsCurrent(pointer);

    if(!paused) TemporizedSlider.scheduleNextChange();
  };

  TemporizedSlider.clearTimer = function(timeOut, clearTimeoutFnc) {
    if (!clearTimeoutFnc) clearTimeoutFnc = clearTimeout;

    clearTimeoutFnc(timeOut);
  };

  TemporizedSlider.changeContent = function(obj, targetFields, afterChange) {
    TemporizedSlider.getElement(targetFields.image_id).src = obj.image;
    TemporizedSlider.getElement(targetFields.title_id).innerHTML = obj.title;
    TemporizedSlider.getElement(targetFields.text_id).innerHTML = obj.text;

    if (afterChange) afterChange();
  };

  TemporizedSlider.getElement = function (id, DOMHandler) {
    if (!DOMHandler) DOMHandler = document;

    return DOMHandler.getElementById(id);
  };

  TemporizedSlider.scheduleNextChange = function() {
    clearTimeout(timeOut);
    timeOut = setTimeout('TemporizedSlider.play(true)', collection[pointer].time * 1000);
  };

  TemporizedSlider.applyEventFor = function (id, event) {
    var htmlElm = TemporizedSlider.getElement(id);
    if (htmlElm) {
      htmlElm.onclick = event;
      return htmlElm;
    }
  }

  TemporizedSlider.loadControls = function(controls) {
    if (!controls.load)
      return false;

    TemporizedSlider.applyEventFor(
      controls.ids.play, controls.functions.play
    );

    TemporizedSlider.applyEventFor(
      controls.ids.pause, controls.functions.pause
    );

    TemporizedSlider.applyEventFor(
      controls.ids.previous, controls.functions.previous
    );

    TemporizedSlider.applyEventFor(
      controls.ids.next, controls.functions.next
    );
  };

  TemporizedSlider.loadGallery = function(args, gallery) {
    if (!gallery.load)
      return false;

    var gallery = TemporizedSlider.getElement(args.gallery.id);
    var imgUrl, title, container, galleryImgItem;
    for(var i in args.data) {
      imgUrl = args.data[i].image;
      imgTitle = args.data[i].title;
      gallery.innerHTML += '<div class="gallery_item"><img class="gallery_img" src="' + imgUrl + '" alt="' + imgTitle + '" data-index="' + i + '" onclick="TemporizedSlider.GalleryItemClick(this)"/></div>';
      galleryImgs = document.getElementsByClassName("gallery_img");
      galleryImgItem = galleryImgs[galleryImgs.length-1];
    };
  };

  TemporizedSlider.GalleryItemClick = function(e) {
    TemporizedSlider.changeContent(e.dataset.index);
    if(!paused) TemporizedSlider.scheduleNextChange();
    TemporizedSlider.markGalleryItemAsCurrent(e);
  }

  TemporizedSlider.markGalleryItemAsCurrent = function(elem) {
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
      functions : {
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
})()
