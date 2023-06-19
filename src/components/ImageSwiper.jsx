import React from 'react';
import PropTypes from 'prop-types';
import {Image, Platform, StyleSheet, View} from "react-native";
import {BlurView} from "expo-blur";
import Swiper from "react-native-swiper";
import {BLACK, GRAY, PRIMARY, WHITE} from "../colors";

const ImageSwiper = ({photos}) => {
    return (
        <Swiper loop={false} dot={<View style={styles.dot}/>} activeDot={<View style={styles.activeDot}/>}>
            {photos.map((photo, idx) => (
                <View key={idx} style={styles.photo}>
                    <Image source={{uri: photo.uri ?? photo}} style={StyleSheet.absoluteFill} resizeMode={'cover'}/>

                    <BlurView intensity={Platform.select({ios: 10, android: 100})}>
                        <Image source={{uri: photo.uri ?? photo}} style={styles.photo} resizeMode={'contain'}/>
                    </BlurView>
                </View>
            ))}
        </Swiper>
    );
};

ImageSwiper.propTypes = {
    photos: PropTypes.array.isRequired
};


const styles = StyleSheet.create({
    photo: {
        width: '100%',
        height: '100%',
    },
    dot: {
        backgroundColor: BLACK,
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3
    },
    activeDot: {
        backgroundColor: PRIMARY.DEFAULT,
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3
    }
})


export default ImageSwiper;
