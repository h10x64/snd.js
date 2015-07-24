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
!function(a,b){"function"==typeof define&&define.amd?define(["snd.SoundEnvironment"],b):"object"==typeof exports||(a.snd=b(a.snd))}(this,function(a){return a.three={version:"0.1.20150606",beta:!0},a.three.mode={},a.three.mode.NONE=0,a.three.mode.POSTURE=1,a.three.mode.DOPPLER=2,a.three.mode.DELAY=4,a.three.mode.ALL=7,a.SOUND_ENVIRONMENT=new a.SoundEnvironment,a.three.update=function(b){if(null==a.SOUND_ENVIRONMENT.cameras[b.id])return void console.log("mainCamera("+b.toString()+") is not added.");if(null==a.SOUND_ENVIRONMENT.cameras[b.id].listener.listener){for(var c in a.SOUND_ENVIRONMENT.cameras)a.SOUND_ENVIRONMENT.cameras[c].listener.resetListener();a.SOUND_ENVIRONMENT.cameras[b.id].listener.setListener(a.AUDIO_CONTEXT.listener)}for(var c in a.SOUND_ENVIRONMENT.cameras){var d=a.SOUND_ENVIRONMENT.cameras[c].camera,e=a.SOUND_ENVIRONMENT.cameras[c].listener;a.three.link(d,e)}for(var c in a.SOUND_ENVIRONMENT.attaches)for(var f=a.SOUND_ENVIRONMENT.attaches[c].object,g=0;g<a.SOUND_ENVIRONMENT.attaches[c].sources.length;g++){var h=a.SOUND_ENVIRONMENT.attaches[c].sources[g];a.three.link(f,h)}},a.three.addCamera=function(b){var c=b.id;if(null!=a.SOUND_ENVIRONMENT.cameras[c])return void console.warn("snd.SOUND_ENVIRONMENT already has camera("+b.toString()+").");var d=new a.Listener(null);a.SOUND_ENVIRONMENT.cameras[c]={camera:b,listener:d},a.SOUND_ENVIRONMENT.addListener(d)},a.three.removeCamera=function(b){null!=a.SOUND_ENVIRONMENT.cameras[b.id]&&(a.SOUND_ENVIRONMENT.removeListener(a.SOUND_ENVIRONMENT.cameras[b.id].listener),delete a.SOUND_ENVIRONMENT.cameras[b.id])},a.three.attach=function(b,c){var d=b.id;null==a.SOUND_ENVIRONMENT.attaches[d]&&(a.SOUND_ENVIRONMENT.attaches[d]={object:b,sources:[]}),a.SOUND_ENVIRONMENT.attaches[d].sources.push(c),a.SOUND_ENVIRONMENT.linkMap[c.id]=d},a.three.detach=function(b){var c=b.id;if(null!=a.SOUND_ENVIRONMENT.linkMap[c]){var d=a.SOUND_ENVIRONMENT.linkMap[c],e=a.SOUND_ENVIRONMENT.attaches[d].sources.indexOf(b);e>=0&&a.SOUND_ENVIRONMENT.attaches[d].sources.splice(e,1),delete a.SOUND_ENVIRONMENT.linkMap[c]}},a.three.getSoundNodes=function(b){return a.SOUND_ENVIRONMENT.attaches[b.id].sources},a.three.link=function(a,b){if(!(isNaN(a.position.x)||isNaN(a.position.y)||isNaN(a.position.z)||isNaN(a.quaternion.x)||isNaN(a.quaternion.y)||isNaN(a.quaternion.z)||isNaN(a.quaternion.w))){var c=new THREE.Matrix4;c.copy(a.matrixWorld);var d=new THREE.Matrix4;d.copy(c),d.elements[12]=0,d.elements[13]=0,d.elements[14]=0;var e=new THREE.Vector3(c.elements[12],c.elements[13],c.elements[14]),f=new THREE.Vector3(-c.elements[8],-c.elements[9],-c.elements[10]),g=new THREE.Vector3;g.copy(a.up),g.applyMatrix4(d),b.setPosition(e.x,e.y,e.z),b.setOrientation(f.x,f.y,f.z,g.x,g.y,g.z)}},a});