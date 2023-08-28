import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import { Renderer } from 'expo-three';

global.THREE = global.THREE || THREE; // 전역 객체로 설정


const loadModelAsync = async (objUri, mtlUri) => {
    const mtlLoader = new THREE.MTLLoader();
    const materials = await new Promise((resolve, reject) => {
        mtlLoader.load(mtlUri, resolve, null, reject);
    });

    materials.preload();

    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    const obj = await new Promise((resolve, reject) => {
        objLoader.load(objUri, resolve, null, reject);
    });

    return obj;
};

const ThreeDimensionScreen = () => {
    const glViewRef = useRef(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    const onContextCreate = async (gl) => {
        console.log('시작2');
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const sceneColor = '#FFFFFF';

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
        camera.position.set(2, 5, 5);

        // Renderer
        const renderer = new Renderer({ gl, width, height });
        renderer.setClearColor(sceneColor);

        // Model
        const objAsset = Asset.fromModule(require('../../../assets/3d/australian_cattle_dog_v3.obj'));
        await objAsset.downloadAsync();
        const mtlAsset = Asset.fromModule(require('../../../assets/3d/australian_cattle_dog_v3.mtl'));
        await mtlAsset.downloadAsync();
        const objUri = objAsset.localUri;
        const mtlUri = mtlAsset.localUri;

        const model = await loadModelAsync(objUri, mtlUri);
        scene.add(model);

        // Light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        // Render loop
        const render = () => {
            requestAnimationFrame(render);
            model.rotation.y += 0.01;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);

            console.log(model.rotation.y);

            gl.endFrameEXP();
        };

        setModelLoaded(true);
        render();
    };

    return (
        <View style={styles.container}>
            <GLView
                ref={glViewRef}
                style={{ flexGrow: 1 }}
                onContextCreate={onContextCreate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    }
});

export default ThreeDimensionScreen;
