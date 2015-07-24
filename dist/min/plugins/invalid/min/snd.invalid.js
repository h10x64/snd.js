/**
 * snd.js - The Sound Library for JavaScript with WebAudioAPI - v.1.0 beta
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 - 2015 N_H <h.10x64@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 **/
!function(a,b){"function"==typeof define&&define.amd?define(["snd"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.invalid={varsion:"0.1.20150606",isBeta:!0},a.invalid.CLASS_DEF=[],a.invalid.TAG_DEF={},jQuery&&jQuery.cssHooks&&(a.invalid.doesCSSHooked={}),a.invalid.init=function(){var b=new MutationObserver(a.invalid.observeCallback);b.observe(document.body,{childList:!0,subTree:!0});for(var c=Object.keys(a.invalid.TAG_DEF),d=0;d<c.length;d++)for(var e=c[d],f=document.getElementsByTagName(e),g=0;g<f.length;g++){var h=f[g];a.invalid.Element.setup(h,a.invalid.TAG_DEF[e])}for(var d=0;d<c.length;d++)for(var e=c[d],f=document.getElementsByTagName(e),g=0;g<f.length;g++){var h=f[g];h._invalid&&h._invalid.setConnectTo()}},a.invalid.observeCallback=function(b,c){for(var d=0;d<b.length;d++){var e=b[d],f=e.target;if("childList"==e.type){for(var d=0;d<e.addedNodes.length;d++){var g=e.addedNodes[d],h=g._invalid;if(!h){var i=g.tagName.toLowerCase();if(!(i in a.invalid.TAG_DEF))continue;a.invalid.Element.setup(g,a.invalid.TAG_DEF[i]),g._invalid.setConnectTo()}}for(var d=0;d<e.removedNodes.length;d++){var g=e.removedNodes[d],h=g._invalid;h&&h.disconnectFromAll()}var j=a.invalid.getMethod(f,"nodeCallback");"function"==typeof j&&j(e,c)}else{var h=f._invalid;if(h)if("attributes"==e.type){var k=a.invalid.getMethod(f,"attributeCallback");"function"==typeof k&&k(e,c);var l=e.attributeName;l&&h.changeAttribute(e,c)}else if("characterData"==e.type){var m=a.invalid.getMethod(f,"characterDataCallback");"function"==typeof m&&m(e,c)}}}},a.invalid.getSetting=function(a){if(a._invalid){for(var b=a._invalid,c=b._settings,d=1;d<arguments.length;d++){var e=arguments[d];if(!c[e])return void 0;c=c[e]}return c}return void 0},a.invalid.getMethod=function(b){if(!b._invalid||!b._invalid._obj)return void 0;var c=a.invalid.getSetting.apply(this,arguments);return"string"==typeof c?b._invalid._obj[c]:void 0},a.invalid.attributeCallback=function(a,b){for(var c=0;c<a.length;c++){var d=a[c],e=d.target._invalid;if(e){var f=e._settings.attributeCallback;"function"==typeof e._obj[f]&&e._obj[f](a,b)}var g=[];if(e._lastAttributes)for(var c=0;c<d.target.attributes;c++)d.target.attributes[c].nodeValue!=e._lastAttributes[c].nodeValue&&g.push(d.target.attributes[c].nodeName);else for(var c=0;c<d.target.attributes;c++)g.push(d.target.attributes[c].nodeName);e.changeAttribute(g),e._lastAttributes=d.target.attributes}},a.invalid.Element=function(b,c){var d=c["class"];this._htmlElem=b,this._settings=c,this._observer=new MutationObserver(a.invalid.observeCallback),this._connection={"in":{},out:{}},this._obj=new d(b.id),this._lastAttribute={},this._observer.observe(b,{childlist:!0,attributes:!0})},a.invalid.Element.prototype.setAttribute=function(b){if("style"==b)this.setStyle();else if("connectto"!=b){var c=a.invalid.getSetting(this._htmlElem,"attributes",b),d=this._htmlElem.getAttribute(b);if(c)"function"==c.type?this._obj[c.name](d):"property"==c.type&&(this._obj[c.name]=d);else{var e=a.invalid.getSetting(this._htmlElem,"events",b);if(e){var f=this;this._obj[e]=function(){window.eval(f._htmlElem.getAttribute(e))}}}}},a.invalid.Element.prototype.setConnectTo=function(){var a,b=this._htmlElem.getAttribute("connectto");a="string"==typeof b?b.replace(/^\s*/,"").replace(/\s*$/,"").replace(/\s+/gm," ").split(","):b,this.changeConnectTo(a)},a.invalid.Element.prototype.setStyle=function(){for(var b=a.invalid.Element.parseStyleAttribute(this._htmlElem),c=Object.keys(b),d=0;d<c.length;d++){var e=c[d],f=a.invalid.getSetting(this._htmlElem,"styles",e);f&&("function"==f.type?this._obj[f.name](b[e]):"property"==f.type&&(this._obj[f.name]=b[e]))}},a.invalid.Element.prototype.changeAttribute=function(a){var b=a.attributeName.toLowerCase();"connectto"==b?this.setConnectTo():this.setAttribute(b)},a.invalid.Element.prototype.changeStyle=function(){setStyle()},a.invalid.Element.prototype.changeConnectTo=function(a){if(a){for(var b=Object.keys(this._connection.out),c=0;c<b.length;c++)a.indexOf(b[c])<0&&this.disconnect(b[c]);for(var c=0;c<a.length;c++)this._connection.out[a[c]]||this.connect(a[c])}Object.keys(this._connection.out).length<=0&&this.connect("MASTER")},a.invalid.Element.prototype.connected=function(a){a._invalid._connection.out["#"+a.id]=!0,this._connection["in"]["#"+a.id]=!0},a.invalid.Element.prototype.connect=function(b){var c=b.replace(/^\s*/,"").replace(/\s$/,"");if("MASTER"==c.toUpperCase())return this._obj.connect(a.MASTER),void(this._connection.out.MASTER=!0);if(c)for(var d=document.querySelectorAll(c),e=0;e<d.length;e++){var f=d[e];if(f&&!this._connection.out["#"+f.id]){if(!f._invalid)return void console.log("Tag #"+f.id+" isn't snd-tag.");this._obj.connect(f._invalid._obj),this._connection.out["#"+f.id]=!0,f._invalid.connected(f)}}},a.invalid.Element.prototype.disconnected=function(a){delete a._invalid._connection.out["#"+a.id],delete this._connection["in"]["#"+a.id]},a.invalid.Element.prototype.disconnect=function(b){if("MASTER"==b.toUpperCase())return this._obj.disconnect(a.MASTER),void delete this._connection.out.MASTER;if(b)for(var c=document.querySelectorAll(b),d=0;d<c.length;d++){var e=c[d];if(e&&this._connection.out["#"+e.id]){if(!e._invalid)return void console.log("Tag #"+e.id+" isn't snd-tag.");this._obj.disconnect(e._invalid._obj),delete this._connection.out["#"+e.id],e._invalid.disconnected(e)}}},a.invalid.Element.prototype.disconnectFromAll=function(){var a=Object.keys(this._connection.out);if(a.length>0)for(var b=0;b<a.length;b++)this.disconnect(a[b]);if(a=Object.keys(this._connection["in"]),a.length>0)for(var b=0;b<a.length;b++){var c=document.querySelector(a[b]);c&&c._invalid._obj.disconnect(this._obj)}},a.invalid.Element.setup=function(b,c){var d=new a.invalid.Element(b,c);b._invalid=d;for(var e=c.styles,f=c.methods,g=c.parameters,h=Object.keys(e),i=0;i<h.length;i++)!function(a,b){var c=a,d=e[h[c]],f=function(){return void 0},g=function(){};"function"==d.type?(f=function(){return b._invalid._obj[d.func.getter]()},g=function(a){return b._invalid._obj[d.func.setter](a)}):"property"==d.type&&(f=function(){return b._invalid._obj[d.name]},g=function(a){return b._invalid._obj[d.name]=a}),Object.defineProperty(b.style,h[c],{get:function(){return f()},set:function(a){g(a)}})}(i,b);for(var j=0;j<b.attributes.length;j++)b._invalid.setAttribute(b.attributes[j].name);h=Object.keys(f);for(var i=0;i<h.length;i++)!function(a,b){var c=a,d=f[h[c]];b[h[c]]=function(){b._invalid._obj[d].apply(b._invalid._obj,arguments)}}(i,b);if(g&&g.length>0)for(var j=0;j<g.length;j++){var k=g[j];a.invalid.ParamElement.setup(b,k)}if(jQuery&&jQuery.cssHooks&&(e=c.styles)){h=Object.keys(e);for(var j=0;j<h.length;j++){var l=h[j];!function(a){var b=a;jQuery.cssHooks[b]||(jQuery.cssHooks[b]={get:function(a){return a.style[b]},set:function(a,c){a.style[b]=c}})}(l)}}},a.invalid.Element.parseStyleAttribute=function(a){if(!a)return void 0;var b=a.getAttribute("style");if(!b)return void 0;for(var c={},d=b.split(";"),e=0;e<d.length;e++){var f=d[e].replace(/\s+/gm," ").replace(/^\s*/,"").replace(/\s*$/,""),g=f.split(":");c[g[0]]=g[1]}return c},a.invalid.ParamElement=function(a,b){this._htmlElem=a,this._obj=b,this._connection={"in":{}}},a.invalid.ParamElement.setup=function(b,c){var d=document.createElement(c.name),e=b._invalid._obj[c.param],f=new a.invalid.ParamElement(d,e);d._invalid=f,b.appendChild(d)},a.invalid.ParamElement.prototype.connected=function(b){var c=this._htmlElem.parentNode;if(!c)throw new a.Exception("#"+this._htmlElem.id+" have not parent node.");if(!c._invalid)throw new a.Exception("#"+c.id+" isn't snd-tag.(or lost _invalid accidentary.)");c._invalid._connection["in"]["#"+b.id]=!0,b._invalid._connection["in"]["#"+this._htmlElem.id]=!0},a.invalid.ParamElement.prototype.disconnected=function(b){var c=this._htmlElem.parentNode;if(!c)throw new a.Exception("#"+this._htmlElem.id+" have not parent node.");if(!c._invalid)throw new a.Exception("#"+c.id+" isn't snd-tag.(or lost _invalid accidentary.)");delete c._invalid._connection["in"]["#"+b.id],delete b._invalid._connection.out["#"+this._htmlElem.id]},a});