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
define(["snd.AudioDataManager"],function(a){return a.ENCODE=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"],a.DECODE={A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,a:26,b:27,c:28,d:29,e:30,f:31,g:32,h:33,i:34,j:35,k:36,l:37,m:38,n:39,o:40,p:41,q:42,r:43,s:44,t:45,u:46,v:47,w:48,x:49,y:50,z:51,0:52,1:53,2:54,3:55,4:56,5:57,6:58,7:59,8:60,9:61,"+":62,"/":63},a.ENCRYPT_PATH="./prease/rewrite/this/path/",a.ENCRYPT_BASE_URL=a.ENCRYPT_PATH+"encrypt.rb?file=",a.KEY_GEN_BASE_URL=a.ENCRYPT_PATH+"createKey.rb?code=",a.AudioDataManager.prototype.addEncryptSource=function(b,c){var d=this,e=a.ENCRYPT_BASE_URL+c;this._dataMap[b]={doesLoaded:!1};var f=new XMLHttpRequest;f.open("GET",e,!0),f.responseType="text",f.onload=function(){return f.response?void d.decrypt(f.response,function(c){a.AUDIO_CONTEXT.decodeAudioData(c,function(a){d._dataMap[b].data=a,d._dataMap[b].doesLoaded=!0,d.loaded(b,a)})}):void console.error("Request Failed: "+f.status)},this._requests[b]=f},a.AudioDataManager.prototype.decrypt=function(b,c){var d=b.split("|"),e=d[0],f=d[1],g=new XMLHttpRequest;g.open("GET",a.KEY_GEN_BASE_URL+e,!0),g.responseType="json",g.onload=function(){if(!g.response)return void console.error("Request Failed: "+g.status);for(var b=[],d=0,e=g.response.key,h=0;h<f.length;h++){if("\n"!=f[h]&&"="!=f[h]){var i=a.DECODE[f[h]];i=i>=e[d]?i-e[d]:i-e[d]+64,b.push(a.ENCODE[i])}else"="==f[h]&&b.push(f[h]);d++,d%=e.length}for(var j=window.atob(b.join("")),k=new ArrayBuffer(j.length),l=new Uint8Array(k),h=0;h<k.byteLength;h++)l[h]=255&j.charCodeAt(h);c(k)},g.send()},a});