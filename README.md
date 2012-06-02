#TemporizedSlider.js

A micro js that implements a customizable temporized image slider, with custom text and title for each one.

##Usage
###Basic
```javascript
TemporizedSlider.init({
  'data' : [{
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
Optionally, callbacks could be used on specific moments to trigger custom actions.
```javascript
TemporizedSlider.init({
  'data' : [{
    image : 'https://www.google.com.br/images/srpr/logo3w.png',
    title : 'my title',
    text  : 'temporized text',
    time  : 18
  }],
  'beforeInit' : function() {
    console.warn('initiating');
  },
  'afterInit' : function() {
    console.warn('initiated');
  },
  'afterChange' : function() {
    console.warn('changed');
  }
});
```

##Licence
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
