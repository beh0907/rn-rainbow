import React, { useCallback, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { PRIMARY } from '../../Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import GallerySwiperItem from '../../components/item/GallerySwiperItem';
import GallerySwiperItem2 from '../../components/item/GallerySwiperItem2';

const { BASE_URL_FILE } = Constants.expoConfig.extra;
const THUMB_SIZE = 80;

const GallerySwiperScreen = () => {
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

        galleryRef?.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0.5
        });

        thumbRef?.current?.scrollToIndex({
            index: index,
            animated: true,
            viewPosition: 0.5
        });
    }, [activityIndex, setActivityIndex, galleryRef, thumbRef]);

    return (
        <View style={{ marginTop: top, marginBottom: bottom }}>

            <FlashList
                snapToInterval={0.1}
                estimatedListSize={{ width, height }}
                scrollEnabled={scrollEnabled}
                initialScrollIndex={position}
                extraData={[activityIndex, scrollEnabled]}
                data={galleries}
                ref={galleryRef}
                estimatedItemSize={width}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={event => {
                    scrollToActivityIndex(Math.round(event.nativeEvent.contentOffset.x / width));
                }}
                renderItem={({ item, index }) => {
                    return (
                        <GallerySwiperItem item={item} setScrollEnable={setScrollEnable} />
                    );
                }}
            />

            <View style={{ position: 'absolute', bottom: THUMB_SIZE / 2 }}>
                <FlashList
                    disableHorizontalListHeightMeasurement
                    estimatedListSize={{ width, height: THUMB_SIZE }}
                    initialScrollIndex={position}
                    extraData={activityIndex}
                    ref={thumbRef}
                    estimatedItemSize={THUMB_SIZE}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={galleries}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable onPress={() => scrollToActivityIndex(index)}
                                       style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
                                <Image progressiveRenderingEnabled
                                       recyclingKey={index.toString()}
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
