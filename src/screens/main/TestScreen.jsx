import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WHITE } from '../../Colors';
import Carousel from 'react-native-anchor-carousel';

const CameraExample = () => {
    const { top, bottom } = useSafeAreaInsets();
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        // 앱이 처음 실행될 때 권한을 요청합니다.
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('카메라 권한이 필요합니다.');
        }
    };

    const pickImageFromCamera = async () => {
        const { status } = await ImagePicker.getCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('카메라 권한이 필요합니다.');
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });

            if (result.assets) {
                setImageUri(result.assets[0].uri);
            }

        } catch (e) {
            if (e.message.includes('Call to function \'ExponentImagePicker.launchCameraAsync\' has been rejected')) {
                console.log(e);
            } else {
                throw e;
            }
        }
    };

    const { width } = useWindowDimensions();
    return (
        <View style={styles.container}>
            {/*{imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}*/}
            {/*<Button title='카메라 열기' onPress={pickImageFromCamera} />*/}

            <Carousel
                loop={true}
                width={width}
                height={width / 2}
                autoPlay={true}
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={10}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: WHITE
    }
});

export default CameraExample;
