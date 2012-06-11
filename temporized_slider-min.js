/**
 * TemporizedSlider.js
 *
 * Copyright 2012, Lukas Alexandre
 * Licensed under MIT
 *
 * @module temporized_slider
*/var TemporizedSlider={};TemporizedSlider.init=function(a){args=a,args.beforeInit!=null&&args.beforeInit();var b={default_time:0,image_id:"slider_image",title_id:"slider_title",text_id:"slider_text",controls:{load:!0,ids:{play_id:"play_control",pause_id:"pause_control",previous_id:"previous_control",next_id:"next_control"},functions:{play:function(){TemporizedSlider.play()},pause:function(){TemporizedSlider.pause()},previous:function(){TemporizedSlider.previous()},next:function(){TemporizedSlider.next()}}}};for(var c in b)typeof args[c]=="undefined"&&(args[c]=b[c]);for(var c in b.controls)typeof args.controls[c]=="undefined"&&(args.controls[c]=b.controls[c]);typeof args.data!="undefined"&&(args.controls.load&&TemporizedSlider.defineClicks(),collection=a.data,pointer=-1,end=collection.length-1,timeOut=null,paused=!1,args.afterInit!=null&&args.afterInit(),TemporizedSlider.play(!0))},TemporizedSlider.play=function(a){if(paused||a)args.beforePlay!=null&&args.beforePlay(),paused=!1,pointer=pointer+1>end?0:pointer+1,TemporizedSlider.changeContent(),TemporizedSlider.scheduleNextChange()},TemporizedSlider.pause=function(){paused||(args.beforePause!=null&&args.beforePause(),paused=!0,clearTimeout(timeOut),pointer=pointer-1<0?0:pointer-1)},TemporizedSlider.previous=function(){pointer=pointer-1>=0?pointer-1:end,TemporizedSlider.changeContent(),paused||TemporizedSlider.scheduleNextChange()},TemporizedSlider.next=function(){pointer=pointer+1<=end?pointer+1:0,TemporizedSlider.changeContent(),paused||TemporizedSlider.scheduleNextChange()},TemporizedSlider.changeContent=function(){var a=collection[pointer];document.getElementById(args.image_id).src=a.image,document.getElementById(args.title_id).innerHTML=a.title,document.getElementById(args.text_id).innerHTML=a.text,args.afterChange!=null&&args.afterChange()},TemporizedSlider.scheduleNextChange=function(){clearTimeout(timeOut),timeOut=setTimeout("TemporizedSlider.play(true)",collection[pointer].time*1e3)},TemporizedSlider.defineClicks=function(){var a=document.getElementById("play_control");a.onclick=function(){args.controls.functions.play()};var b=document.getElementById("pause_control");b.onclick=function(){args.controls.functions.pause()};var c=document.getElementById("previous_control");c.onclick=function(){args.controls.functions.previous()};var d=document.getElementById("next_control");d.onclick=function(){args.controls.functions.next()}};