import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PRIMARY, WHITE } from '../../Colors';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AutoHeightImage from 'react-native-auto-height-image';
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const GalleryItem = memo(({ item, onPress, isDeleteMode, isSelected }) => {
    const { width } = useWindowDimensions();

    const imageUrl = `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}`;
    const IMAGE_WIDTH = width / 3 - 14;

    const checkBoxRef = useRef(null);


    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.container, { opacity: pressed ? 0.5 : 1 }]}>
            <AutoHeightImage style={styles.image} width={IMAGE_WIDTH}
                             source={{ uri: imageUrl }} />


            {/*<Image style={[styles.image, { width: IMAGE_WIDTH, aspectRatio: 1 }]}*/}
            {/*       source={imageUrl}*/}
            {/*       contentFit={'contain'}*/}
            {/*       onProgress={event => console.log(event)} />*/}


            {isDeleteMode &&
                <View
                    style={[styles.selectItem, { backgroundColor: isSelected ? 'rgba(107,114,128,0.7)' : 'transparent' }]}>
                    <BouncyCheckbox
                        onPress={onPress}
                        disableText
                        disableBuiltInState
                        ref={checkBoxRef}
                        style={{ position: 'absolute', top: 10, left: 10 }}
                        isChecked={isSelected}
                        size={20}
                        fillColor={PRIMARY.DEFAULT}
                        unfillColor='#FFFFFF'
                    />
                </View>
            }

        </Pressable>
    );
});

GalleryItem.propTypes = {
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        backgroundColor: WHITE,
        flex: 1
    },
    image: {
        borderRadius: 12
    },
    selectItem: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 12
    }
});

export default GalleryItem;
