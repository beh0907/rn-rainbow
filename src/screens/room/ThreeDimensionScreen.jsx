import React, { useRef } from 'react';
import { View } from 'react-native';
// import { GLView } from 'expo-gl';
// import * as THREE from 'three';
// import ExpoTHREE from 'expo-three';
// import { Asset } from 'expo-asset';

// global.THREE = global.THREE || THREE; // 전역 객체로 설정

const ThreeDimensionScreen = () => {
    // const glViewRef = useRef(null);
    //
    // const onContextCreate = async (gl) => {
    //     const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    //
    //     const scene = new THREE.Scene();
    //     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    //     camera.position.z = 5;
    //
    //     const renderer = new ExpoTHREE.Renderer({ gl });
    //     renderer.setSize(width, height);
    //
    //     const australianCattleDogBump = Asset.fromModule(require('../../../assets/3d/australian_cattle_dog_bump.jpg'));
    //     const australianCattleDogDif = Asset.fromModule(require('../../../assets/3d/australian_cattle_dog_dif.jpg'));
    //     const australianCattleDogObj = Asset.fromModule(require('../../../assets/3d/australian_cattle_dog_v3.obj'));
    //     const australianCattleDogMtl = Asset.fromModule(require('../../../assets/3d/australian_cattle_dog_v3.mtl'));
    //
    //     await Promise.all([
    //         australianCattleDogBump.downloadAsync(),
    //         australianCattleDogDif.downloadAsync(),
    //         australianCattleDogObj.downloadAsync(),
    //         australianCattleDogMtl.downloadAsync(),
    //     ]);
    //
    //     const resources = {
    //         'australian_cattle_dog_bump.jpg': australianCattleDogBump.uri,
    //         'australian_cattle_dog_dif.jpg': australianCattleDogDif.uri,
    //         'australian_cattle_dog_v3.obj': australianCattleDogObj.uri,
    //         'assets/3d/australian_cattle_dog_v3.mtl': australianCattleDogMtl.uri,
    //     };
    //
    //     // Load textures asynchronously
    //     const bumpTexture = await ExpoTHREE.loadAsync({
    //         asset: resources['australian_cattle_dog_bump.jpg'],
    //     });
    //
    //     const difTexture = await ExpoTHREE.loadAsync({
    //         asset: resources['australian_cattle_dog_dif.jpg'],
    //     });
    //
    //     // Load OBJ and MTL asynchronously
    //     const obj = await ExpoTHREE.loadAsync(
    //         [resources['australian_cattle_dog_v3.obj'], resources['assets/3d/australian_cattle_dog_v3.mtl']],
    //         null,
    //         imageName => resources[imageName]
    //     );
    //
    //     obj.traverse(child => {
    //         if (child instanceof THREE.Mesh) {
    //             child.material.map = difTexture; // Diffuse texture
    //             child.material.bumpMap = bumpTexture; // Bump texture
    //             child.material.bumpScale = 0.2; // Adjust the bump effect
    //         }
    //     });
    //
    //     scene.add(obj);
    //
    //     const animate = () => {
    //         requestAnimationFrame(animate);
    //         renderer.render(scene, camera);
    //     };
    //     animate();
    // };

    return (
        <View style={{ flex: 1 }}>
            {/*<GLView*/}
            {/*    ref={glViewRef}*/}
            {/*    style={{ flex: 1 }}*/}
            {/*    onContextCreate={onContextCreate}*/}
            {/*/>*/}
        </View>
    );
};

export default ThreeDimensionScreen;
