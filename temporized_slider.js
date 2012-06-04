/**
 * TemporizedSlider.js
 *
 * Copyright 2012, Lukas Alexandre
 * Licensed under MIT
 *
 * @module temporized_slider
*/

var TemporizedSlider = {};

TemporizedSlider.init = function(options) {
  args = options;

  if (args.beforeInit != null) args.beforeInit();

  var default_args = {
    default_time : 0,
    image_id : 'slider_image',
    title_id : 'slider_title',
    text_id : 'slider_text',
    controls : {
      ids : {
        play_id : 'play_control',
        pause_id : 'pause_control',
        previous_id : 'previous_control',
        next_id : 'next_control'
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
    }
  };

  for(var index in default_args) {
    if(typeof args[index] === "undefined") args[index] = default_args[index];
  }

  if (typeof args.data !== "undefined") {
    TemporizedSlider.defineClicks();

    collection = options.data;

    pointer = -1;
    end = collection.length - 1;
    timeOut = null;
    paused = false;

    if (args.afterInit != null) args.afterInit();
    TemporizedSlider.play(true);
  }
};

TemporizedSlider.play = function(force_play) {
  if (paused || force_play) {
    if (args.beforePlay != null) args.beforePlay();
    paused = false;
    pointer = (pointer + 1 > end) ? 0 : (pointer + 1);

    TemporizedSlider.changeContent();
    TemporizedSlider.scheduleNextChange();
  }
};

TemporizedSlider.pause = function() {
  if (!paused) {
    if (args.beforePause != null) args.beforePause();

    paused = true;

    clearTimeout(timeOut);
    pointer = (pointer - 1 < 0) ? 0 : (pointer - 1);
  }
};

TemporizedSlider.previous = function() {
  pointer = (pointer - 1 >= 0) ? (pointer - 1) : end;

  TemporizedSlider.changeContent();

  if(!paused) TemporizedSlider.scheduleNextChange();
};

TemporizedSlider.next = function() {
  pointer = (pointer + 1 <= end) ? (pointer + 1) : 0;

  TemporizedSlider.changeContent();

  if(!paused) TemporizedSlider.scheduleNextChange();
};

TemporizedSlider.changeContent = function() {
  var obj = collection[pointer];
  document.getElementById(args.image_id).src = obj.image;
  document.getElementById(args.title_id).innerHTML = obj.title;
  document.getElementById(args.text_id).innerHTML = obj.text;
  if (args.afterChange != null) args.afterChange();
};

TemporizedSlider.scheduleNextChange = function() {
  clearTimeout(timeOut);
  timeOut = setTimeout('TemporizedSlider.play(true)', collection[pointer].time * 1000);
};

TemporizedSlider.defineClicks = function() {
  var play_control = document.getElementById('play_control');
  play_control.onclick = function() {
    args.controls.functions.play();
  };
  var pause_control = document.getElementById('pause_control');
  pause_control.onclick = function() {
    args.controls.functions.pause();
  };
  var previous_control = document.getElementById('previous_control');
  previous_control.onclick = function() {
    args.controls.functions.previous();
  };
  var next_control = document.getElementById('next_control');
  next_control.onclick = function() {
    args.controls.functions.next();
  };
};