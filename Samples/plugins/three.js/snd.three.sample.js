require(["assets", "snd.three", "snd.three.util", "snd.Listener", "snd.BufferSoundNode"], function(assets, snd){
            // Set three.js measurement length to "cm"
            //  ex.) obj3D.setPosition(100, 0, 0) mean setPosition(100cm, 0cm, 0cm)
            snd.SOUND_ENVIRONMENT.setUnitPrefix(snd.SoundEnvironment.prefix.centi);

            /**************************/

            var SCREEN_WIDTH = window.innerWidth;
            var SCREEN_HEIGHT = window.innerHeight;

            var MOVE_SPEED = 5;
            var ROTATE_SPEED = Math.PI / 180;

            var container, stats;
            var camera, scene, renderer, matchSoundMesh, bgmSoundMesh;
            var cameraRig, activeCamera, activeHelper;
            var cameraPerspective, cameraOrtho;
            var cameraPerspectiveHelper, cameraOrthoHelper;

            var SOUND_DATA = {
                "match": assets["test"],
                "BGM": assets["01_Liftoff_(Get_High)"]
            };
            var MATCH_SOUND_NODE = null;
            var BGM_SOUND_NODE = null;
            var clock = new THREE.Clock();

            var cameraMove = {
                forward: false,
                backward: false,
                left: false,
                right: false,
                pitchUp: false,
                pitchDown: false,
                turnLeft: false,
                turnRight: false
            };
            var cameraEulerAngle = new THREE.Euler(0, 0, 0, "YXZ");

            /* Load sound effect(s) into AudioBuffer and callback initialize methods when the sound(s) are loaded. */
            //snd.three.util.createBufferSoundNodes(data, connectToMaster, callback)
            // @param data hashmap 読み込むオーディオデータのURLとIDをまとめたハッシュマップ
            // @param connectToMaster boolean snd.MASTERへ接続するか否か
            // @param callback function データ読み込み終了時に呼ばれるコールバック関数
            snd.three.util.createBufferSoundNodes(SOUND_DATA, true, function(ret) {
                // Set created sound into the global var.
                MATCH_SOUND_NODE = ret["match"];
                BGM_SOUND_NODE = ret["BGM"];

                // Initialize 3D objects
                init();

                // Initialize Sound objects
                initSound();

                // Start animation
                animate();
            });

            function initSound() {
                snd.three.attach(bgmSoundMesh, BGM_SOUND_NODE);
                BGM_SOUND_NODE.setLoop(true);
                BGM_SOUND_NODE.start();

                snd.three.attach(matchSoundMesh, MATCH_SOUND_NODE);
                MATCH_SOUND_NODE.setLoop(true);
                MATCH_SOUND_NODE.start();

                snd.three.addCamera(cameraPerspective);
                snd.three.addCamera(cameraOrtho);
            };

            function init() {
                container = document.createElement('div');
                document.body.appendChild(container);

                initCamera();

                initGeometory();

                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
                renderer.domElement.style.position = "relative";
                container.appendChild(renderer.domElement);

                renderer.autoClear = false;

                stats = new Stats();
                container.appendChild(stats.domElement);

                window.addEventListener('resize', onWindowResize, false);
                document.addEventListener('keydown', onKeyDown, false);
                document.addEventListener('keyup', onKeyUp, false);
            }

            function initCamera() {
                scene = new THREE.Scene();

                // Setting up Overlook camera
                camera = new THREE.PerspectiveCamera(50, 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
                camera.position.y = 2500;

                // Setting up parspective camera
                cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT, 10, 1000);
                // !! YOU MUST SET matrixAutoUpdate !!
                cameraPerspective.matrixAutoUpdate = true;

                cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
                scene.add(cameraPerspectiveHelper);

                // Setting up Orthographic camera
                cameraOrtho = new THREE.OrthographicCamera(0.5 * SCREEN_WIDTH / -2, 0.5 * SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2, 10, 1000);
                // !! YOU MUST SET matrixAutoUpdate !!
                cameraOrtho.matrixAutoUpdate = true;

                cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);
                scene.add(cameraOrthoHelper);

                // Set activeCamera to the parspective camera. (that is rendered in the left side of the window)
                activeCamera = cameraPerspective;
                activeHelper = cameraPerspectiveHelper;

                // counteract different front orientation of cameras vs rig

                cameraOrtho.rotation.y = Math.PI;
                cameraPerspective.rotation.y = Math.PI;

                cameraRig = new THREE.Object3D();
                cameraRig.useQuaternion = true;

                cameraRig.add(cameraPerspective);
                cameraRig.add(cameraOrtho);

                scene.add(cameraRig);
            }

            function initGeometory() {
                // Create Sound Object
                matchSoundMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 8), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
                scene.add(matchSoundMesh);

                bgmSoundMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 8), new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true}));
                scene.add(bgmSoundMesh);

                // Create Particles (Stars)
                var geometry = new THREE.Geometry();

                for (var i = 0; i < 10000; i++) {

                    var vertex = new THREE.Vector3();
                    vertex.x = THREE.Math.randFloatSpread(2000);
                    vertex.y = THREE.Math.randFloatSpread(2000);
                    vertex.z = THREE.Math.randFloatSpread(2000);

                    geometry.vertices.push(vertex);

                }

                var particles = new THREE.ParticleSystem(geometry, new THREE.ParticleSystemMaterial({color: 0x888888}));
                scene.add(particles);

                //Create Base Grid
                var gridGeometry = new THREE.Geometry();
                var gridMaterial = new THREE.LineBasicMaterial({transparent: true, color: 0xFFFFFF, opacity:0.5});
                for (var i = -2000; i < 2000; i += 100) {
                    gridGeometry.vertices.push(new THREE.Vector3(i, -100, -2000));
                    gridGeometry.vertices.push(new THREE.Vector3(i, -100, 2000));
                    gridGeometry.vertices.push(new THREE.Vector3(-2000, -100, i));
                    gridGeometry.vertices.push(new THREE.Vector3(2000, -100, i));
                }
                var grid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);

                scene.add(grid);
            }

            /** Events **/

            function onKeyDown(event) {
                switch (event.keyCode) {
                    case 79: /*O*/
                        activeCamera = cameraOrtho;
                        activeHelper = cameraOrthoHelper;
                        break;
                    case 80: /*P*/
                        activeCamera = cameraPerspective;
                        activeHelper = cameraPerspectiveHelper;
                        break;
                        // Camera Motion
                    case 87:/*W*/
                        cameraMove.forward = true;
                        break;
                    case 65:/*A*/
                        cameraMove.left = true;
                        break;
                    case 83:/*S*/
                        cameraMove.backward = true;
                        break;
                    case 68:/*D*/
                        cameraMove.right = true;
                        break;
                        // Camera Rotation
                    case 73: /*I*/
                        cameraMove.pitchUp = true;
                        break;
                    case 75: /*K*/
                        cameraMove.pitchDown = true;
                        break;
                    case 74: /*J*/
                        cameraMove.turnLeft = true;
                        break;
                    case 76: /*L*/
                        cameraMove.turnRight = true;
                        break;
                }
            };

            function onKeyUp(event) {
                switch (event.keyCode) {
                    // Camera Motion
                    case 87:/*W*/
                        cameraMove.forward = false;
                        break;
                    case 65:/*A*/
                        cameraMove.left = false;
                        break;
                    case 83:/*S*/
                        cameraMove.backward = false;
                        break;
                    case 68:/*D*/
                        cameraMove.right = false;
                        break;
                        // Camera Rotation
                    case 73: /*I*/
                        cameraMove.pitchUp = false;
                        break;
                    case 75: /*K*/
                        cameraMove.pitchDown = false;
                        break;
                    case 74: /*J*/
                        cameraMove.turnLeft = false;
                        break;
                    case 76: /*L*/
                        cameraMove.turnRight = false;
                        break;
                }
            };

            function onWindowResize(event) {

                SCREEN_WIDTH = window.innerWidth;
                SCREEN_HEIGHT = window.innerHeight;

                renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

                camera.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
                camera.updateProjectionMatrix();

                cameraPerspective.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
                cameraPerspective.updateProjectionMatrix();

                cameraOrtho.left = -0.5 * SCREEN_WIDTH / 2;
                cameraOrtho.right = 0.5 * SCREEN_WIDTH / 2;
                cameraOrtho.top = SCREEN_HEIGHT / 2;
                cameraOrtho.bottom = -SCREEN_HEIGHT / 2;
                cameraOrtho.updateProjectionMatrix();

            }

            /** Animation & Render **/

            function animate() {
                requestAnimationFrame(animate);

                // Move Objects
                moveObjects();

                // Render
                render();

                // Update stats
                stats.update();

                // Update snd.js
                snd.three.update(activeCamera, clock.getElapsedTime());
            }

            function render() {
                renderer.clear();

                activeHelper.visible = false;

                renderer.setViewport(2 * SCREEN_WIDTH / 3, 0, SCREEN_WIDTH / 3, 2 * SCREEN_HEIGHT / 3);
                renderer.render(scene, activeCamera);

                activeHelper.visible = true;

                renderer.setViewport(0, 0, 2 * SCREEN_WIDTH / 3, SCREEN_HEIGHT);
                renderer.render(scene, camera);
            }

            function moveObjects() {
                var r = Date.now() * 0.0005;

                matchSoundMesh.position.x = 700 * Math.cos(r);
                matchSoundMesh.position.z = 700 * Math.sin(r);

                bgmSoundMesh.position.x = 0;
                bgmSoundMesh.position.z = 500;

                if (activeCamera === cameraPerspective) {
                    cameraPerspective.updateProjectionMatrix();

                    cameraPerspectiveHelper.update();
                    cameraPerspectiveHelper.visible = true;

                    cameraOrthoHelper.visible = false;
                } else {
                    cameraOrtho.updateProjectionMatrix();

                    cameraOrthoHelper.update();
                    cameraOrthoHelper.visible = true;

                    cameraPerspectiveHelper.visible = false;
                }

                /* move camera position */

                // Rotate Parspective / Orthographic camera

                if (cameraMove.turnLeft) {
                    cameraEulerAngle.y += ROTATE_SPEED;
                } else if(cameraMove.turnRight) {
                    cameraEulerAngle.y -= ROTATE_SPEED;
                }
                if (cameraMove.pitchUp) {
                    cameraEulerAngle.x += ROTATE_SPEED;
                } else if (cameraMove.pitchDown) {
                    cameraEulerAngle.x -= ROTATE_SPEED;
                }
                cameraRig.quaternion.setFromEuler(cameraEulerAngle);

                // Move Parspective / Orthographic camera

                if (cameraMove.forward) {
                    cameraRig.position.z += MOVE_SPEED;
                } else if (cameraMove.backward) {
                    cameraRig.position.z -= MOVE_SPEED;
                }
                if (cameraMove.left) {
                    cameraRig.position.x += MOVE_SPEED;
                } else if (cameraMove.right) {
                    cameraRig.position.x -= MOVE_SPEED;
                }

                // Move Overlook camera

                camera.position.x = cameraRig.position.x;
                camera.position.z = cameraRig.position.z;
                camera.up = new THREE.Vector3(0,0,1);
                camera.lookAt(new THREE.Vector3(camera.position.x, 0, camera.position.z));
            }


});
