import * as React from 'react';
import { useRef, useState } from 'react';
import { GLView } from 'expo-gl';
import { loadObjAsync, loadTextureAsync, Renderer } from 'expo-three';
import { AmbientLight, HemisphereLight, PerspectiveCamera, PointLight, Scene } from 'three';
import { DIALOG_MODE } from '../../components/message/CustomDialog';
import { readRoom } from '../../api/Room';
import { useDialogState } from '../../contexts/DialogContext';

global.THREE = global.THREE || THREE; // 전역 객체로 설정


const ThreeDimensionScreen = () => {
    const [, setDialog] = useDialogState();

    const modelRef = useRef(null);
    const glViewRef = useRef(null);

    const isMultiTouchRef = useRef(false);
    const previousX1Ref = useRef(0);
    const previousY1Ref = useRef(0);
    const previousX2Ref = useRef(0);
    const previousY2Ref = useRef(0);

    const loadModel = async (item) => {
        const texturesLength = item.textures?.length || 0;
        console.log(`[loadModel] -> Textures length: ${texturesLength}`);
        const textures = [];
        for (let i = 0; i < texturesLength; i++) {
            const texture = await loadTextureAsync({
                asset: item.textures[i].image
            });
            if (item.type === 'glb') {
                texture.flipY = false;
            }
            textures.push({ name: item.textures[i]?.name || '-', map: texture });
        }
        console.log(`[loadModel] -> Textures done loading`);

        const obj = await loadObjAsync({
            asset: item.model,
            mtlAsset: item?.material || undefined
        });

        console.log(`[loadModel] -> Model done loading, adding textures now...`);

        if (texturesLength > 0) {
            if (texturesLength === 1) {
                obj.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        object.material.map = textures[0]?.map;
                    }
                });
            } else {
                obj.traverse((object) => {
                    if (object instanceof THREE.Mesh) {
                        const selected = textures?.find(x => x.name === object.name);
                        object.material.map = selected?.map;
                    }
                });
            }
        }
        console.log(`[loadModel] -> Textures done applied...`);

        if (item.scale) {
            obj.scale.set(item.scale.x, item.scale.y, item.scale.z);
        }
        if (item.position) {
            obj.position.set(item.position.x, item.position.y, item.position.z);
        }
        if (item.rotation) {
            obj.rotation.x = item.rotation.x;
            obj.rotation.y = item.rotation.y;
            obj.rotation.z = item.rotation.z;
        }

        console.log(`[loadModel] -> Complied`);
        return obj;
    };

    const onContextCreate = async (gl) => {
        setDialog({
            message: '3D 모델을 불러오고 있습니다......',
            visible: true,
            mode: DIALOG_MODE.LOADING
        });

        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0xabd2c3;

        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(sceneColor);

        const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 100);

        const scene = new Scene();

        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 30, 100);
        // scene.add(pointLight);

        // HemisphereLight - color feels nicer
        const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(hemisphereLight);

        // AmbientLight - add more brightness?
        const ambientLight = new AmbientLight(0x404040); // soft white light
        scene.add(ambientLight);

        const australian_cattle_dog_v3 = {
            type: 'obj',
            name: 'australian_cattle_dog_v3',
            isometric: false,
            model: require('../../../assets/3d/australian_cattle_dog_v3.obj'),
            material: require('../../../assets/3d/australian_cattle_dog_v3.mtl'),
            textures: [
                {
                    name: 'map_Ka',
                    image: require('../../../assets/3d/australian_cattle_dog_dif.jpg')
                },
                {
                    name: 'map_Kd',
                    image: require('../../../assets/3d/australian_cattle_dog_dif.jpg')
                },
                {
                    name: 'map_bump',
                    image: require('../../../assets/3d/australian_cattle_dog_bump.jpg')
                },
                {
                    name: 'bump',
                    image: require('../../../assets/3d/australian_cattle_dog_bump.jpg')
                },
                {
                    name: 'australian_cattle_dog_bump',
                    image: require('../../../assets/3d/australian_cattle_dog_bump.jpg')
                },
                {
                    name: 'australian_cattle_dog_dif',
                    image: require('../../../assets/3d/australian_cattle_dog_dif.jpg')
                }
            ],
            scale: {
                x: 1,
                y: 1,
                z: 1
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        };

        const model = await loadModel(australian_cattle_dog_v3);
        modelRef.current = model;
        scene.add(model);

        // Setup an animation loop
        const render = () => {
            requestAnimationFrame(render);
            renderer.render(scene, camera);

            gl.endFrameEXP();
        };

        render();
        setDialog({visible: false});
    };

    const onStartShouldSetResponder = (event) => {
        const { numberActiveTouches } = event.touchHistory;

        if (numberActiveTouches === 1) {
            previousX1Ref.current = event.nativeEvent.touches[0]?.pageX;
            previousY1Ref.current = event.nativeEvent.touches[0]?.pageY;

            isMultiTouchRef.current = false;
        } else if (numberActiveTouches === 2) {
            previousX1Ref.current = event.nativeEvent.touches[0]?.pageX;
            previousY1Ref.current = event.nativeEvent.touches[0]?.pageY;

            previousX2Ref.current = event.nativeEvent.touches[1]?.pageX;
            previousY2Ref.current = event.nativeEvent.touches[1]?.pageY;
            isMultiTouchRef.current = true;
        }
    };

    const onMoveShouldSetResponder = (event) => {
        const { numberActiveTouches } = event.touchHistory;

        const X1 = event.nativeEvent?.pageX
        const Y1 = event.nativeEvent?.pageY

        const deltaX1 = X1 - previousX1Ref.current;
        const deltaY1 = Y1 - previousY1Ref.current;

        if (numberActiveTouches === 1 && !isMultiTouchRef.current) { // 1손가락 터치
            let rotate = 0;
            if (Math.abs(deltaX1) > Math.abs(deltaY1)) {
                rotate = deltaX1 / 100;
                rotateObjY(rotate);
            } else {
                rotate = deltaY1 / 100;
                rotateObjX(rotate);
            }

            // const sensitivity = 0.01; // 회전 감도 조절
            // const rotateX = deltaY1 * sensitivity;
            // const rotateY = -deltaX1 * sensitivity;
            // const rotateZ = 0; // 여기에 필요한 경우 z 축 회전을 추가할 수 있습니다.
            // rotateObj(rotateX, rotateY, rotateZ);

        } else if (numberActiveTouches === 2 && isMultiTouchRef.current) { // 2손가락 터치
            const X2 = event.nativeEvent.touches[1]?.pageX;
            const Y2 = event.nativeEvent.touches[1]?.pageY;

            const deltaX2 = X2 - previousX2Ref.current;
            const deltaY2 = Y2 - previousY2Ref.current;

            const len1 =  Math.sqrt((previousX1Ref.current - previousX2Ref.current) * (previousX1Ref.current - previousX2Ref.current) +
                (previousY1Ref.current - previousY2Ref.current) * (previousY1Ref.current - previousY2Ref.current));
            const len2 = Math.sqrt((X1 - X2) * (X1 - X2) + (Y1 - Y2) * (Y1 - Y2));

            if (Math.abs(deltaX1) < Math.abs(deltaY1) && Math.abs(deltaX2) < Math.abs(deltaY2)) {
                let move = 0;
                if (deltaY1 * deltaY2 > 0) {
                    move = -deltaY1 / 10;
                    translate(0, move, 0);
                } else {
                    move = (len2 - len1) / 50;
                    pinchZoom(move);
                }
            } else if (Math.abs(deltaX1) > Math.abs(deltaY1) && Math.abs(deltaX2) > Math.abs(deltaY2)) {
                let move = 0;
                if (deltaX1 * deltaX2 > 0) {
                    move = deltaX1 / 10;
                    translate(move, 0, 0);
                } else {
                    move = (len2 - len1) / 50;
                    pinchZoom(move);
                }
            }

            previousX2Ref.current = event.nativeEvent.touches[1]?.pageX;
            previousY2Ref.current = event.nativeEvent.touches[1]?.pageY;
        }

        previousX1Ref.current = event.nativeEvent.touches[0]?.pageX;
        previousY1Ref.current = event.nativeEvent.touches[0]?.pageY;
    };

    const onTouchEnd = () => {
        isMultiTouchRef.current = false;
    };

    const rotateObjX = (angle) => {
        modelRef.current.rotation.x += angle
        console.log("x : ", modelRef.current.rotation.x)
    };

    const rotateObjY = (angle) => {
        console.log("y : ", modelRef.current.rotation.y)
        modelRef.current.rotation.y += angle
        // modelRef.current.rotation.z += angle
    };

    const rotateObj = (angleX, angleY, angleZ) => {
        modelRef.current.rotation.x += angleX
        modelRef.current.rotation.y += angleY
        modelRef.current.rotation.z += angleZ
    };

    const translate = (x, y, z) => {
        modelRef.current.position.x += x;
        modelRef.current.position.y += y;
        modelRef.current.position.z += z;
    };

    const pinchZoom = (move) => {
        // Assuming parsedObject is your 3D object
        const currentScale = modelRef.current.scale.x;
        let newScale = currentScale + move;

        // Define minimum and maximum scale and ensure it's within the range
        const minScale = 0.5;
        const maxScale = 5.0;
        if (newScale < minScale) {
            newScale = minScale;
        } else if (newScale > maxScale) {
            newScale = maxScale;
        }

        const scaleRatio = newScale / currentScale;

        modelRef.current.scale.x *= scaleRatio;
        modelRef.current.scale.y *= scaleRatio;
        modelRef.current.scale.z *= scaleRatio;
    };

    return (
        <GLView
            onStartShouldSetResponder={onStartShouldSetResponder}
            onMoveShouldSetResponder={onMoveShouldSetResponder}
            // onTouchEnd={onTouchEnd}
            ref={glViewRef}
            style={{ flex: 1 }}
            onContextCreate={onContextCreate}
            key={'d'}
        />
    );
};

export default ThreeDimensionScreen;
