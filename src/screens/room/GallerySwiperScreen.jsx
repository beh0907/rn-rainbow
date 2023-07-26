import React, {useEffect, useState} from 'react';
import {ImageGallerySwiper} from "react-native-image-gallery-swiper";
import {useRoute} from "@react-navigation/native";
import {BASE_URL_FILE} from "@env"

const GallerySwiperScreen = () => {
    const {params} = useRoute()
    const {galleries, position} = params
    const images = galleries.map((gallery) => {
        const id = gallery.seq
        const name = gallery.name
        const url = `${BASE_URL_FILE}${gallery.id}/${gallery.roomNum}/gallery/${name}`

        // 새로운 객체 생성하여 반환
        return {id, name, url};
    });
    const [swipedImage, setSwipedImage] = useState('');

    return (
        <ImageGallerySwiper
            images={images}
            swipeUp={() => console.log('up')}
            swipeDown={() => console.log('down')}
            showThumbs
            getSwipedImage={setSwipedImage}
            activeImage={position}
            // setHandlePressRight={handlePressRight}
            // textStyles={{ fontSize: 20, color: 'white', backgroundColor: 'green' }}
            // imageStyles={{ height: 300 }}
        >
            {/*<View>*/}
            {/*    <Text> Children will show here </Text>*/}
            {/*</View>*/}
        </ImageGallerySwiper>
    );
};

GallerySwiperScreen.propTypes = {

};

export default GallerySwiperScreen;
