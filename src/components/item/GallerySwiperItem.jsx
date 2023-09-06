import React, { memo } from 'react';
import { useWindowDimensions } from 'react-native';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const GallerySwiperItem = memo(({ item }) => {
    const { width, height } = useWindowDimensions();

    return (
        <Image
            recyclingKey={item.seq.toString()}
            source={{ uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}` }}
            contentFit='contain'
            style={[{ width, height }]}
        />
    );
});

export default GallerySwiperItem;
