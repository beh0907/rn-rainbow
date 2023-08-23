import React, { useCallback } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import { IconButton } from 'react-native-paper';
import { WHITE } from '../../Colors';
import { BackHandler } from 'react-native';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const GallerySwiperScreen = () => {
    const { params } = useRoute();
    const { galleries, position } = params;
    const navigation = useNavigation();

    const images = galleries.map((gallery) => {
        const id = gallery.seq;
        const name = gallery.name;
        const url = `${BASE_URL_FILE}${gallery.id}/${gallery.roomNum}/gallery/${name}`;
        const thumbUrl = `${BASE_URL_FILE}${gallery.id}/${gallery.roomNum}/gallery/s_${name}`;

        // 새로운 객체 생성하여 반환
        return { id, name, url, thumbUrl };
    });

    const closeGallery = () =>  {
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', closeGallery);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', closeGallery);
            };
        }, [])
    );

    return (
        <ImageGallery close={closeGallery} isOpen={true} images={images} initialIndex={position}
                      renderHeaderComponent={() => <IconButton icon={'arrow-left'} size={30} iconColor={WHITE} onPress={closeGallery} />} />


        // <ImageGallerySwiper
        //     images={images}
        //     swipeUp={() => console.log('up')}
        //     swipeDown={() => console.log('down')}
        //     showThumbs
        //     getSwipedImage={setSwipedImage}
        //     activeImage={position}
        //     // setHandlePressRight={handlePressRight}
        //     // textStyles={{ fontSize: 20, color: 'white', backgroundColor: 'green' }}
        //     // imageStyles={{ height: 300 }}
        // >
        //     {/*<View>*/}
        //     {/*    <Text> Children will show here </Text>*/}
        //     {/*</View>*/}
        // </ImageGallerySwiper>
    );
};

GallerySwiperScreen.propTypes = {};

export default GallerySwiperScreen;
