import React from 'react';
import { useRoute } from '@react-navigation/native';
import ImageZoom from 'react-native-image-pan-zoom';
import { useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';

const ImageControlScreen = () => {
    const { params } = useRoute();
    const {width, height} = useWindowDimensions()

    return (
        <ImageZoom
            maxScale={3}
            minScale={0.8}
            useNativeDriver
            cropWidth={width}
            cropHeight={height}
            imageWidth={width}
            imageHeight={height}>
            <Image style={{width:width, height:height}}
                   source={{uri:params.url}} contentFit={"contain"}/>
        </ImageZoom>
    );
};

export default ImageControlScreen;
