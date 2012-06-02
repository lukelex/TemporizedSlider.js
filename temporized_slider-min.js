/**
 * TemporizedSlider.js
 *
 * Copyright 2012, Lukas Alexandre
 * Licensed under MIT
 *
 * @module temporized_slider
*/var TemporizedSlider={};TemporizedSlider.init=function(a){args=a,args.beforeInit!=null&&args.beforeInit();var b={default_time:0};for(var c in b)typeof args[c]=="undefined"&&(args[c]=b[c]);typeof args.data!="undefined"&&(collection=a.data,pointer=-1,end=collection.length-1,timeOut=null,paused=!1,args.afterInit!=null&&args.afterInit())},TemporizedSlider.play=function(){paused=!1,pointer=pointer+1>end?0:pointer+1,TemporizedSlider.changeContent(),TemporizedSlider.scheduleNextChange()},TemporizedSlider.pause=function(){paused=!0,clearTimeout(timeOut),pointer=pointer-1<0?0:pointer-1},TemporizedSlider.previous=function(){pointer=pointer-1>=0?pointer-1:end,TemporizedSlider.changeContent(),paused||TemporizedSlider.scheduleNextChange()},TemporizedSlider.next=function(){pointer=pointer+1<=end?pointer+1:0,TemporizedSlider.changeContent(),paused||TemporizedSlider.scheduleNextChange()},TemporizedSlider.changeContent=function(){var a=collection[pointer];document.getElementById("slider_image").src=a.image,document.getElementById("slider_title").innerHtml=a.title,document.getElementById("slider_title").textContent=a.title,document.getElementById("slider_text").innerHtml=a.text,document.getElementById("slider_text").textContent=a.text,args.afterChange!=null&&args.afterChange()},TemporizedSlider.scheduleNextChange=function(){clearTimeout(timeOut),timeOut=setTimeout("TemporizedSlider.play()",collection[pointer].time*1e3)};