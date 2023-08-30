import * as React from 'react';
import { GLView } from 'expo-gl';
import { loadObjAsync, loadTextureAsync, Renderer } from 'expo-three';
import { AmbientLight, HemisphereLight, PerspectiveCamera, PointLight, Scene } from 'three';

global.THREE = global.THREE || THREE; // 전역 객체로 설정


const ThreeDimensionScreen = () => {

    const loadModel = async function(item) {
        const texturesLength = item.textures?.length || 0;
        console.log(`[loadModel] -> Textures length: ${texturesLength}`);
        const textures = [];
        for (let i = 0; i < texturesLength; i++) {
            const texture = await loadTextureAsync({
                asset: item.textures[i].image,
            });
            if (item.type === 'glb') {
                texture.flipY = false;
            }
            textures.push({ name: item.textures[i]?.name || '-', map: texture });
        }
        console.log(`[loadModel] -> Textures done loading`);
        // console.log(textures);

        const obj = await loadObjAsync({
            asset: item.model,
            mtlAsset: item?.material || undefined,
        });

        console.log(`[loadModel] -> Model done loading, adding textures now...`);

        if (texturesLength > 0) {
            if (texturesLength === 1) {
                obj.traverse(function(object) {
                    if (object instanceof THREE.Mesh) {
                        object.material.map = textures[0]?.map;
                    }
                });
            } else {
                obj.traverse(function(object) {
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
        return obj;
    };

    const onContextCreate = async (gl) => {
        // const {setRenderer, setCamera, setScene} = data;
        // const { selected } = data;
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = 0xabd2c3;
        // Create a WebGLRenderer without a DOM element
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
                    name: 'australian_cattle_dog_dif',
                    image: require('../../../assets/3d/australian_cattle_dog_dif.jpg')
                },
                {
                    name: 'australian_cattle_dog_bump',
                    image: require('../../../assets/3d/australian_cattle_dog_bump.jpg')
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
                z: 2
            },
            animation: {
                rotation: {
                    y: 0.01 // to animate horizontally
                }
            }
        };

        const model = await loadModel(australian_cattle_dog_v3);
        scene.add(model);

        function update() {
            // define your own update here
            // eg. if (model) model.rotation.y += icebear.animation.rotation.y;
        }

        // Setup an animation loop
        const render = () => {
            requestAnimationFrame(render);
            update();
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };

        render();
    };

    return (
        <GLView
            style={{ flex: 1 }}
            onContextCreate={onContextCreate}
        />
    );
};

export default ThreeDimensionScreen;
