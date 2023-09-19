import React, { memo } from 'react';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

const GallerySwiperItem = memo(({ recyclingKey, imageUrl, width, height }) => {

    return (
        <Image
            recyclingKey={recyclingKey}
            source={{ uri: imageUrl }}
            contentFit='contain'
            style={[{ width, height }]}
        />
    );
});

export default GallerySwiperItem;
