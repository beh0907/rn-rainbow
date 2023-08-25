import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { PRIMARY } from '../../Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

const { BASE_URL_FILE } = Constants.expoConfig.extra;
const THUMB_SIZE = 80;
const SPACING = 10;

const GallerySwiperScreen = () => {
    const { params } = useRoute();
    const { galleries, position } = params;

    const galleryRef = useRef(null);
    const thumbRef = useRef(null);

    const [activityIndex, setActivityIndex] = useState(0);

    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();

    useEffect(() => {
        scrollToActivityIndex(position);
    }, []);

    const scrollToActivityIndex = useCallback((index) => {
        setActivityIndex(index);
        galleryRef?.current?.scrollToOffset({
            offset: index * width,
            animated: true
        });

        if (index * (THUMB_SIZE + SPACING) - THUMB_SIZE / 2 > width / 2) {
            thumbRef?.current?.scrollToOffset({
                offset: index * (THUMB_SIZE + SPACING) - width / 2 + THUMB_SIZE / 2,
                animated: true
            });
        } else {
            thumbRef?.current?.scrollToOffset({
                offset: 0,
                animated: true
            });
        }
    }, [setActivityIndex, galleryRef, thumbRef]);

    return (
        <View style={{ marginTop: top, marginBottom: bottom }}>
            <FlashList
                ref={galleryRef}
                estimatedListSize={{ width, height }}
                estimatedItemSize={height}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                data={galleries}
                keyExtractor={(item, index) => index.toString()}
                onMomentumScrollEnd={event => {
                    scrollToActivityIndex(Math.round(event.nativeEvent.contentOffset.x / width));
                }}
                renderItem={({ item }) => {
                    return (
                        // <GallerySwiperItem
                        //     uri={`${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}`} />

                        <View style={{ width, height }}>
                            <Image style={[StyleSheet.absoluteFillObject]}
                                   contentFit={'contain'}
                                   source={{ uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}` }} />
                        </View>
                    );
                }} />

            <View style={{ position: 'absolute', bottom: THUMB_SIZE / 2 }}>
                <FlatList
                    ref={thumbRef}
                    estimatedListSize={{ width: width, height: THUMB_SIZE }}
                    estimatedItemSize={THUMB_SIZE}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={galleries}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingHorizontal: SPACING }}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable onPress={() => scrollToActivityIndex(index)}
                                       style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                                <Image style={{
                                    width: THUMB_SIZE,
                                    height: THUMB_SIZE,
                                    borderRadius: 12,
                                    marginRight: SPACING,
                                    borderWidth: 4,
                                    borderColor: activityIndex === index ? PRIMARY.LIGHT : 'transparent'
                                }}
                                       source={{ uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/s_${item.name}` }} />
                            </Pressable>
                        );
                    }} />
            </View>
        </View>
    );
};

GallerySwiperScreen.propTypes = {};

export default GallerySwiperScreen;
