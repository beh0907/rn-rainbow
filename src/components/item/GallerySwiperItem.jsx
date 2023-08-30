import React, { memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { PinchGestureHandler, ScrollView } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const GallerySwiperItem = memo(({ item, setScrollEnable }) => {
    const { width, height } = useWindowDimensions();
    const imageScale = useSharedValue(1);
    // const imageX = useSharedValue(0);
    // const imageY = useSharedValue(0);

    let baseScale = 1;

    const minScale = 1;
    const maxScale = 3;

    const pinchHandler = useAnimatedGestureHandler({
        onStart: () => {
            baseScale = imageScale.value;
            runOnJS(setScrollEnable)(false); // UI 스레드에서 호출
        },
        onActive: (event) => {
            imageScale.value = baseScale * event.scale;
        },
        onEnd: () => {
            if (imageScale.value < minScale) {
                imageScale.value = withSpring(minScale);
            } else if (imageScale.value > maxScale) {
                imageScale.value = withSpring(maxScale);
            }

            runOnJS(setScrollEnable)(true); // UI 스레드에서 호출
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: imageScale.value }]
        };
    });

    return (
        <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View style={{ width, height }}>
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <Animated.Image
                        source={{ uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}` }}
                        resizeMode='contain'
                        style={[{ width, height }, animatedStyle]}
                    />
                </ScrollView>
            </Animated.View>
        </PinchGestureHandler>
    );
});

export default GallerySwiperItem;
