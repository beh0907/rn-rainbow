import React, { memo } from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
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
        onStart: (event, context) => {
            baseScale = imageScale.value;

            console.log('터치 시작');
            // runOnJS(setScrollEnable)(false); // UI 스레드에서 호출
        },
        onActive: (event) => {
            imageScale.value = baseScale * event.scale;
            console.log('터치 중');
        },
        onEnd: (event) => {
            if (imageScale.value < minScale) {
                imageScale.value = withSpring(minScale);
            } else if (imageScale.value > maxScale) {
                imageScale.value = withSpring(maxScale);
            }

            console.log('터치 끝');
            // runOnJS(setScrollEnable)(true); // UI 스레드에서 호출
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: imageScale.value }]
        };
    });

    return (
        <GestureHandlerRootView>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
                <Animated.Image
                    source={{ uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}` }}
                    resizeMode='contain'
                    style={[{ width, height }, animatedStyle]}
                />
            </PinchGestureHandler>
        </GestureHandlerRootView>
    );
});

export default GallerySwiperItem;
