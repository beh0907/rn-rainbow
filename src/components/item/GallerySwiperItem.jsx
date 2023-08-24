import React from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


const GallerySwiperItem = ({ uri }) => {
    const { width, height } = useWindowDimensions();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const panGestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },
        onActive: (event, context) => {
            translateX.value = context.translateX + event.translationX;
            translateY.value = context.translateY + event.translationY;
        },
        onEnd: () => {
            // Add any snapping behavior or boundary checks here if needed
        }
    });

    const pinchGestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
            context.scale = scale.value;
        },
        onActive: (event, context) => {
            scale.value = context.scale * event.scale;
        },
        onEnd: () => {
            // Add any boundary checks for scale here if needed
        }
    });

    const imageStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value }
            ]
        };
    });

    return (
        <GestureHandlerRootView>
            <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
                <Animated.View style={{ flex: 1 }}>
                    <PanGestureHandler onGestureEvent={panGestureHandler}>
                        <Animated.View style={{ flex: 1 }}>
                            <Animated.Image
                                source={{ uri }}
                                style={[{ width, height }, imageStyle]}
                                resizeMode='contain'
                            />
                        </Animated.View>
                    </PanGestureHandler>
                </Animated.View>
            </PinchGestureHandler>
        </GestureHandlerRootView>
    );
};


export default GallerySwiperItem;
