/**
 * snd.js - the Web Audio API library -
 * The Sound Plugin for three.js
 */

snd.three = {version: 0.1, beta: true};

snd.SOUND_ENVIRONMENT.cameras = {}; // {id: {camera: three.js.Camera, listener: snd.js.listener}}
snd.SOUND_ENVIRONMENT.attaches = {}; // {id: {object: three.js.Object3D, sources: snd.js.SoundNode[]}}
snd.SOUND_ENVIRONMENT.linkMap = {};

snd.three.update = function(mainCamera, time) {
    if (snd.SOUND_ENVIRONMENT.cameras[mainCamera.id] == null) {
        console.log.warn("mainCamera(" + mainCamera.toString() + ") is not added.");
        return;
    }
    if (snd.SOUND_ENVIRONMENT.cameras[mainCamera.id].listener.listener == null) {
        for (var id in snd.SOUND_ENVIRONMENT.cameras) {
            snd.SOUND_ENVIRONMENT.cameras[id].listener.resetListener();
        }
        snd.SOUND_ENVIRONMENTcameras[mainCamera.id].listener.setListener(snd.AUDIO_CONTEXT.listener);
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

snd.three.link = function(object3D, posdir) {
    var objPosture = object3D.matrixWorld.elements;
    
    var pos = new snd.vec3(objPosture[12], objPosture[13], objPosture[14]);
    var dir = new snd.vec3(objPosture[8], objPosture[9], objPosture[10]);
    
    var objUp = Object.create(object3D.up);
    var objRot = new THREE.Matrix4(
            objPosture[0], objPosture[4], objPosture[7], 0,
            objPosture[1], objPosture[5], objPosture[8], 0,
            objPosture[2], objPosture[6], objPosture[9], 0,
            0, 0, 0, 1);
    objUp.applyMatrix4(objRot);
    objUp.negate();
    
    posdir.setPosition(pos.x, pos.y, pos.z);
    posdir.setOrientation(dir.x, dir.y, dir.z, objUp.x, objUp.y, objUp.z);
};
