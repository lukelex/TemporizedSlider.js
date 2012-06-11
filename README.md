#TemporizedSlider.js

A micro js that implements a customizable temporized image slider, with custom text and title for each one.

##Usage
###Basics

```javascript
TemporizedSlider.init({
  data : [{
    image : 'https://www.google.com.br/images/srpr/logo3w.png',
    title : 'my title',
    text  : 'temporized text',
    time  : 18
  },{
    image : 'http://railsbrasil.s3.amazonaws.com/sites/4e2c66cde8fb0e0001000004/theme/images/rails.png',
    title : 'my rails title',
    text  : 'temporized rails text',
    time  : 15
  }]
});
TemporizedSlider.pause();     // pause the slider
TemporizedSlider.play();      // Initiate or resume the slider
TemporizedSlider.next();      // go to next slide
TemporizedSlider.previous();  // go to previous slide
```
###Using Callbacks
Optionally, callbacks can be used to trigger custom actions, on specific moments.

```javascript
TemporizedSlider.init({
  data : ... ,
  beforeInit : function() {
    console.warn('initiating');
  },
  afterInit : function() {
    console.warn('initiated');
  },
  afterChange : function() {
    console.warn('changed');
  },
  beforePlay : function() {
    console.warn('playing');
  },
  beforePause : function() {
    console.warn('pausing');
  }
});
```

###HTML Structure
By default, it looks for three elements to interact `#slider_image` ( an image tag ), `#slider_title` ( a container to hold the title content ) and a `#slider_text` ( another container that'll hold the text ).

Those elements can be overwritten through these parameters, like so:

```javascript
TemporizedSlider.init({
  data : ... ,
  image_id : 'my_custom_image_id',
  title_id : 'my_custom_title_id',
  text_id : 'my_custom_text_id'
});
```


###Slider Controls
Controls functionality is provided to handle its basic functions, such as `play`, `pause`, `previous` and `next`.

####Custom Elements
By default, Controls will search for four elements to assign its default actions, using their tag ids, `play_control`, `pause_control`, `previous_control` and `next_control`. It's possible to customize this references through the Controls parameters, as follows:

```javascript
TemporizedSlider.init({
  data : ... ,
  controls : {
    ids : {
      play : 'custom_play_id',
      pause : 'custom_pause_id',
      previous : 'custom_previous_id',
      next : 'custom_next_id'
    }
  }
});
```

####Shutting off Controls
Controls is always on, wich is modifiable through the following parameter:

```javascript
TemporizedSlider.init({
  data : ... ,
  controls : {
    load : false
  }
});
```

####Custom Events
It's also provided a way to customize the functions that handles Controls events. This can be achieved through the following lines:

```javascript
TemporizedSlider.init({
  data : ... ,
  controls : {
    functions : {
      play : function() {
        console.warn('play click');
      },
      pause : function() {
        console.warn('pause click');
      },
      previous : function() {
        console.warn('previous click');
      },
      next : function() {
        console.warn('next click');
      }
    }
  }
});
```

*Notice that if Controls functions are provided you must define within, if desired, the default behavior calls. Such as `TemporizedSlider.next()`, `TemporizedSlider.previous` and so on.

##License
Copyright (c) 2012 Lukas Alexandre. http://www.devinscene.com.br/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to use, copy and modify copies of the Software, subject
to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
