
/**
 * snd.js
 * three.js plugin
 * 
 * The MIT License (MIT)
 * copyright (c) 2014 N_H <h.10x64@gmail.com>
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
 
 

define(["snd.SoundEnvironment"], function(snd) {
    snd.three = {version: "0.1.20150606", beta: true};

    snd.three.mode = {};
    snd.three.mode.NONE = 0x0000;
    snd.three.mode.POSTURE = 0x0001;
    snd.three.mode.DOPPLER = 0x0002;
    snd.three.mode.DELAY = 0x0004;
    snd.three.mode.ALL = 0x0007;

    snd.SOUND_ENVIRONMENT = new snd.SoundEnvironment();

    snd.three.update = function(mainCamera, time) {
        if (snd.SOUND_ENVIRONMENT.cameras[mainCamera.id] == null) {
            console.log("mainCamera(" + mainCamera.toString() + ") is not added.");
            return;
        }
        if (snd.SOUND_ENVIRONMENT.cameras[mainCamera.id].listener.listener == null) {
            for (var id in snd.SOUND_ENVIRONMENT.cameras) {
                snd.SOUND_ENVIRONMENT.cameras[id].listener.resetListener();
            }
            snd.SOUND_ENVIRONMENT.cameras[mainCamera.id].listener.setListener(snd.AUDIO_CONTEXT.listener);
        }

        // update listener posture
        for (var id in snd.SOUND_ENVIRONMENT.cameras) {
            var cam = snd.SOUND_ENVIRONMENT.cameras[id].camera;
            var listener = snd.SOUND_ENVIRONMENT.cameras[id].listener;
            snd.three.link(cam, listener);
        }

        // update source posture
        for (var id in snd.SOUND_ENVIRONMENT.attaches) {
            var obj = snd.SOUND_ENVIRONMENT.attaches[id].object;
            for (var i = 0; i < snd.SOUND_ENVIRONMENT.attaches[id].sources.length; i++) {
                var src = snd.SOUND_ENVIRONMENT.attaches[id].sources[i];
                snd.three.link(obj, src);
            }
        }
    };

    snd.three.addCamera = function(camera) {
        var id = camera.id;
        if (snd.SOUND_ENVIRONMENT.cameras[id] != null) {
            console.warn("snd.SOUND_ENVIRONMENT already has camera(" + camera.toString() + ").");
            return;
        }

        var listener = new snd.Listener(null);

        snd.SOUND_ENVIRONMENT.cameras[id] = {camera: camera, listener: listener};
        snd.SOUND_ENVIRONMENT.addListener(listener);
    };

    snd.three.removeCamera = function(camera) {
        if (snd.SOUND_ENVIRONMENT.cameras[camera.id] != null) {
            snd.SOUND_ENVIRONMENT.removeListener(snd.SOUND_ENVIRONMENT.cameras[camera.id].listener);
            delete snd.SOUND_ENVIRONMENT.cameras[camera.id];
        }
    };

    snd.three.attach = function(object, source) {
        var id = object.id;
        if (snd.SOUND_ENVIRONMENT.attaches[id] == null) {
            snd.SOUND_ENVIRONMENT.attaches[id] = {object: object, sources: []};
        }
        snd.SOUND_ENVIRONMENT.attaches[id].sources.push(source);
        snd.SOUND_ENVIRONMENT.linkMap[source.id] = id;
    };

    snd.three.detach = function(source) {
        var srcID = source.id;
        if (snd.SOUND_ENVIRONMENT.linkMap[srcID] != null) {
            var objID = snd.SOUND_ENVIRONMENT.linkMap[srcID];
            var i = snd.SOUND_ENVIRONMENT.attaches[objID].sources.indexOf(source);
            if (i >= 0) {
                snd.SOUND_ENVIRONMENT.attaches[objID].sources.splice(i, 1);
            }
            delete snd.SOUND_ENVIRONMENT.linkMap[srcID];
        }
    };

    snd.three.getSoundNodes = function(object) {
        return snd.SOUND_ENVIRONMENT.attaches[object.id].sources;
    };

    snd.three.link = function(object3D, posdir) {
        if (!isNaN(object3D.position.x) && !isNaN(object3D.position.y) && !isNaN(object3D.position.z)
                && !isNaN(object3D.quaternion.x) && !isNaN(object3D.quaternion.y) && !isNaN(object3D.quaternion.z) && !isNaN(object3D.quaternion.w)) {
            var objMatrix = new THREE.Matrix4();
            objMatrix.copy(object3D.matrixWorld);

            var rotMatrix = new THREE.Matrix4();
            rotMatrix.copy(objMatrix);
            rotMatrix.elements[12] = 0;
            rotMatrix.elements[13] = 0;
            rotMatrix.elements[14] = 0;

            var objPos = new THREE.Vector3(
                    objMatrix.elements[12],
                    objMatrix.elements[13],
                    objMatrix.elements[14]);
            var objDir = new THREE.Vector3(
                    -objMatrix.elements[8],
                    -objMatrix.elements[9],
                    -objMatrix.elements[10]);

            var objUp = new THREE.Vector3();
            objUp.copy(object3D.up);
            objUp.applyMatrix4(rotMatrix);
            //objUp.negate();

            posdir.setPosition(objPos.x, objPos.y, objPos.z);
            posdir.setOrientation(objDir.x, objDir.y, objDir.z, objUp.x, objUp.y, objUp.z);
        }
    };

    return snd;
});
