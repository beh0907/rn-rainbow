import React, { useCallback, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { PRIMARY } from '../../Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Carousel from 'react-native-reanimated-carousel';
import GallerySwiperItem from '../../components/item/GallerySwiperItem';

const { BASE_URL_FILE } = Constants.expoConfig.extra;
const THUMB_SIZE = 80;

const GallerySwiperScreen = (callback, deps) => {
    const { params } = useRoute();
    const { galleries, position } = params;

    const galleryRef = useRef(null);
    const thumbRef = useRef(null);

    const [activityIndex, setActivityIndex] = useState(position);
    const [scrollEnabled, setScrollEnable] = useState(true);

    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();

    const scrollToActivityIndex = useCallback((index) => {
        setActivityIndex(index);
        console.log('인덱스 : ', index);

        galleryRef?.current?.scrollTo({
            index: index,
            animated: false
        });

        thumbRef?.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0.5
        });
    }, [activityIndex, setActivityIndex, galleryRef, thumbRef]);


    return (
        <View style={{ marginTop: top, marginBottom: bottom }}>
            <Carousel
                panGestureHandlerProps={{
                    activeOffsetX: [-30, 30]
                }}
                snapEnabled={scrollEnabled}
                defaultIndex={position}
                ref={galleryRef}
                onSnapToItem={index => scrollToActivityIndex(index)}
                width={width}
                height={height}
                data={galleries}
                renderItem={({ item }) => <GallerySwiperItem item={item} setScrollEnable={setScrollEnable} />}>
            </Carousel>

            <View style={{ position: 'absolute', bottom: THUMB_SIZE / 2 }}>
                <FlashList
                    initialScrollIndex={position}
                    extraData={activityIndex}
                    ref={thumbRef}
                    estimatedItemSize={THUMB_SIZE}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={galleries}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable onPress={() => scrollToActivityIndex(index)}
                                       style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                                <Image progressiveRenderingEnabled
                                       style={{
                                           width: THUMB_SIZE,
                                           height: THUMB_SIZE,
                                           borderRadius: 12,
                                           marginRight: 10,
                                           borderWidth: 4,
                                           borderColor: activityIndex === index ? PRIMARY.LIGHT : 'transparent'
                                       }}
                                       source={{ uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/s_${item.name}` }}
                                       contentFit={'cover'} />
                            </Pressable>
                        );
                    }}
                />
            </View>
        </View>
    );
};

GallerySwiperScreen.propTypes = {};

export default GallerySwiperScreen;
