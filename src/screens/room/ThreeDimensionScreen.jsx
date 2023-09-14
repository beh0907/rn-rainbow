import * as React from 'react';
import { useRef } from 'react';
import { GLView } from 'expo-gl';
import { loadAsync, Renderer, TextureLoader } from 'expo-three';
import { AmbientLight, HemisphereLight, Mesh, PerspectiveCamera, PointLight, Scene } from 'three';
import { DIALOG_MODE } from '../../components/message/CustomDialog';
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


    const onProgress = async (xhr) => {
        console.log("xhr : ", xhr);
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete) + '% downloaded');
        }
    };

    const loadModel = async (model, resources) => {
        const mesh = await loadAsync(
            [
                model['obj'],
                model['mtl']
            ],
            onProgress,
            null
        );

        mesh.traverse(async child => {
            if (child instanceof Mesh) {
                child.material.flatShading = false;
                child.material.side = THREE.FrontSide;

                /// Apply other maps - maybe this is supposed to be automatic :[
                child.material.map = await loadAsync(resources['dif']);
                child.material.bumpMap = await loadAsync(resources['bump']);
            }
        });

        return mesh;
    };

    const onContextCreate = async (gl) => {
        setDialog({
            message: '3D 모델을 불러오고 있습니다......',
            visible: true,
            mode: DIALOG_MODE.LOADING
        });

        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        // renderer.setClearColor(0x000000, 0);
        // renderer.setClearColor(0xabd2c3);

        const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 100);

        const scene = new Scene();
        scene.background = await loadAsync(require('../../../assets/background/bg_splash.png')); // 백그라운드 이미지 적용


        const pointLight = new PointLight(0xffffff, 2, 1000, 1);
        pointLight.position.set(0, 30, 100);
        // scene.add(pointLight);

        // HemisphereLight - color feels nicer
        const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(hemisphereLight);

        // AmbientLight - add more brightness?
        const ambientLight = new AmbientLight(0x404040); // soft white light
        scene.add(ambientLight);

        const dog = {
            // 'australian_cattle_dog_v3.obj': require('../../../assets/3d/australianCattleDog/obj/australian_cattle_dog_v3.obj'),
            // 'australian_cattle_dog_v3.mtl': require('../../../assets/3d/australianCattleDog/mtl/australian_cattle_dog_v3.mtl'),
            'obj': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/australianCattleDog/obj/australian_cattle_dog_v3.obj',
            'mtl': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/australianCattleDog/mtl/australian_cattle_dog_v3.mtl'
        };

        const dogResources = {
            // 'australian_cattle_dog_dif.jpg': require('../../../assets/3d/australianCattleDog/texture/australian_cattle_dog_dif.jpg'),
            // 'australian_cattle_dog_bump.jpg': require('../../../assets/3d/australianCattleDog/texture/australian_cattle_dog_bump.jpg'),
            'dif': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/australianCattleDog/texture/australian_cattle_dog_dif.jpg',
            'bump': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/australianCattleDog/texture/australian_cattle_dog_bump.jpg'
        };

        // const model = await loadModel(dog, dogResources);

        const cat = {
            // 'australian_cattle_dog_v3.obj': require('../../../assets/3d/australianCattleDog/obj/australian_cattle_dog_v3.obj'),
            // 'australian_cattle_dog_v3.mtl': require('../../../assets/3d/australianCattleDog/mtl/australian_cattle_dog_v3.mtl'),
            'obj': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/Cat/obj/12221_Cat_v1_l3.obj',
            'mtl': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/Cat/mtl/12221_Cat_v1_l3.mtl'
        };

        const catResources = {
            // 'australian_cattle_dog_dif.jpg': require('../../../assets/3d/australianCattleDog/texture/australian_cattle_dog_dif.jpg'),
            // 'australian_cattle_dog_bump.jpg': require('../../../assets/3d/australianCattleDog/texture/australian_cattle_dog_bump.jpg'),
            'dif': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/Cat/texture/Cat_diffuse.jpg',
            'bump': 'https://rainbowbridge.s3.ap-northeast-2.amazonaws.com/3d/Cat/texture/Cat_bump.jpg'
        };

        const model = await loadModel(cat, catResources);
        modelRef.current = model;
        scene.add(model);

        // Setup an animation loop
        const render = () => {
            requestAnimationFrame(render);
            renderer.render(scene, camera);

            gl.endFrameEXP();
        };

        render();
        setDialog({ visible: false });
    };

    //터치 시작할 때 이벤트
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

    //터치 이동할 때 이벤트
    const onMoveShouldSetResponder = (event) => {
        const { numberActiveTouches } = event.touchHistory;

        const X1 = event.nativeEvent?.pageX;
        const Y1 = event.nativeEvent?.pageY;

        const deltaX1 = X1 - previousX1Ref.current;
        const deltaY1 = Y1 - previousY1Ref.current;

        if (numberActiveTouches === 1 && !isMultiTouchRef.current) { // 1손가락 터치
            // let rotate = 0;
            // if (Math.abs(deltaX1) > Math.abs(deltaY1)) {
            //     rotate = deltaX1 / 100;
            //     rotateObjY(rotate);
            // } else {
            //     rotate = deltaY1 / 100;
            //     rotateObjX(rotate);
            // }
            const sensitivity = 0.01; // 회전 감도 조절
            rotateObj(deltaY1 * sensitivity, deltaX1 * sensitivity);

        } else if (numberActiveTouches === 2 && isMultiTouchRef.current) { // 2손가락 터치
            const X2 = event.nativeEvent.touches[1]?.pageX;
            const Y2 = event.nativeEvent.touches[1]?.pageY;

            const deltaX2 = X2 - previousX2Ref.current;
            const deltaY2 = Y2 - previousY2Ref.current;

            const len1 = Math.sqrt((previousX1Ref.current - previousX2Ref.current) * (previousX1Ref.current - previousX2Ref.current) +
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

    //터치 종료할 때 이벤트
    const onTouchEnd = () => {
        isMultiTouchRef.current = false;
    };

    // const rotateObjX = (angle) => {
    //     modelRef.current.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), angle);
    // };
    //
    // const rotateObjY = (angle) => {
    //     modelRef.current.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
    // };

    const rotateObj = (x, y) => {
        modelRef.current.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), x);
        modelRef.current.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), y);
    };

    const translate = (x, y, z) => {
        modelRef.current.position.x += x;
        modelRef.current.position.y += y;
        // modelRef.current.position.z += z;
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
            onTouchEnd={onTouchEnd}
            ref={glViewRef}
            style={{ flex: 1}}
            onContextCreate={onContextCreate}
            key={'d'}
        />
    );
};

export default ThreeDimensionScreen;
