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
  args = options

  if (args.beforeInit != null) args.beforeInit();

  var default_args = {
    'default_time' : 0,
    'image_id' : 'slider_image',
    'title_id' : 'slider_title',
    'text_id' : 'slider_text'
  };

  for(var index in default_args) {
    if(typeof args[index] === "undefined") args[index] = default_args[index];
  }

  if (typeof args.data !== "undefined") {
    collection = options.data;

    pointer = -1;
    end = collection.length - 1;
    timeOut = null;
    paused = false;

    if (args.afterInit != null) args.afterInit();
    TemporizedSlider.play();
  };
};

TemporizedSlider.play = function() {
  paused = false;

  pointer = (pointer + 1 > end) ? 0 : (pointer + 1);

  TemporizedSlider.changeContent();
  TemporizedSlider.scheduleNextChange();
};

TemporizedSlider.pause = function() {
  paused = true;
  clearTimeout(timeOut);
  pointer = (pointer - 1 < 0) ? 0 : (pointer - 1);
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
  document.getElementById(args.title_id).innerHtml = obj.title;
  document.getElementById(args.title_id).textContent = obj.title;
  document.getElementById(args.text_id).innerHtml = obj.text;
  document.getElementById(args.text_id).textContent = obj.text;

  if (args.afterChange != null) args.afterChange();
};

TemporizedSlider.scheduleNextChange = function() {
  clearTimeout(timeOut);
  timeOut = setTimeout('TemporizedSlider.play()', collection[pointer].time * 1000);
};