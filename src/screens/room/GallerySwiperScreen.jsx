import React, { useEffect, useLayoutEffect, useState } from 'react';
import {ImageGallerySwiper} from "react-native-image-gallery-swiper";
import {useRoute} from "@react-navigation/native";
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

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


    useLayoutEffect(() => {
    }, [position, swipedImage, setSwipedImage])

    // useLayoutEffect(() => {
    //     (async () => {
    //         /**탭 네비게이션 설정*/
    //         navigation.setOptions({
    //             headerTitle: 'Room No.' + String(roomNum).padStart(4, '0'),
    //             headerShadowVisible: false,
    //             headerTitleAlign: 'center',
    //             headerRight: () => {
    //                 return (
    //                     user.id === room.id
    //                         ? // 내가 개설한 추모관이라면 방 설정
    //                         <HeaderRight name={'cog'} onPress={() => {
    //                             console.log('방 설정');
    //                         }} />
    //                         : // 아니라면 즐겨찾기
    //                         <HeaderRight color={isBookMark ? PRIMARY.DEFAULT : GRAY.DEFAULT}
    //                                      name={isBookMark ? 'star' : 'star-outline'} onPress={() => {
    //                             setIsBookMark(prev => {
    //                                 const changeState = !prev;
    //
    //                                 changeState ? PreferenceStore.addBookMark(roomNum) : PreferenceStore.removeBookMark(roomNum);
    //
    //                                 setSnackbar({
    //                                     message: changeState ? '즐겨찾기가 등록되었습니다' : '즐겨찾기가 해제되었습니다',
    //                                     visible: true
    //                                 });
    //                                 return !prev;
    //                             });
    //                         }} />);
    //             }
    //         });
    //     })();
    // }, [roomNum, isBookMark, user, room]);

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
