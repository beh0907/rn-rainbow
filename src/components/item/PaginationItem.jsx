import React from 'react';
import { View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { GRAY, PRIMARY } from '../../Colors';

const PaginationItem = ({ index, backgroundColor, length, animValue, isRotate }) => {
    const width = 10;

    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [-width, 0, width];

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1];
            outputRange = [-width, 0, width];
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP
                    )
                }
            ]
        };
    }, [animValue, index, length]);

    return (
        <View
            style={{
                backgroundColor: 'white',
                width,
                height: width,
                borderRadius: 50,
                overflow: 'hidden',
                transform: [
                    {
                        rotateZ: isRotate ? '90deg' : '0deg'
                    }
                ],
                marginHorizontal:5
            }}
        >
            <Animated.View
                style={[
                    {
                        borderRadius: 50,
                        backgroundColor: GRAY.DEFAULT,
                        flex: 1
                    },
                    animStyle
                ]}
            />
        </View>
    );
};

export default PaginationItem;
