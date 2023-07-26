import React, {useRef, useState} from 'react';
import {
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import SimplePaginationDot from "./SimplePaginationDot";
import {BASE_URL_FILE} from "@env"
import CarouselItem from "./CarouselItem";

const ImageCarousel = ({rooms}) => {
    const carouselRef = useRef(null);
    const {width} = useWindowDimensions()
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <View style={styles.container}>
            <Carousel
                style={styles.carousel}
                data={rooms}
                renderItem={({item, index}) => <CarouselItem item={item} index={index} currentIndex={currentIndex} ref={carouselRef}/>}
                itemWidth={0.7 * width}
                inActiveOpacity={0.3}
                containerWidth={width}
                onScrollEnd={(item, index) => setCurrentIndex(index)}
                ref={carouselRef}
            />
            <SimplePaginationDot currentIndex={currentIndex} length={rooms.length}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20
    },
    carousel: {
        aspectRatio: 1.5,
        flexGrow: 0,
        marginBottom: 20,
    },
    item: {
        borderWidth: 2,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        borderColor: 'white',
        elevation: 3,
    },
    imageBackground: {
        flex: 2,
        backgroundColor: '#EBEBEB',
        borderWidth: 5,
        borderColor: 'white',
    },
    rightTextContainer: {
        marginLeft: 'auto',
        marginRight: -2,
        backgroundColor: 'rgba(49, 49, 51,0.5)',
        padding: 3,
        marginTop: 3,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    rightText: {color: 'white'},
    lowerContainer: {
        flex: 1,
        margin: 10,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    contentText: {
        marginTop: 10,
        fontSize: 12,
    },
});

export default ImageCarousel;
