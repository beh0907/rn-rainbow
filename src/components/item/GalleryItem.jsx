import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Card } from 'react-native-paper';
import { PRIMARY, WHITE } from '../../Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const GalleryItem = memo(({ item, onPress, isDeleteMode, isSelected }) => {
    const imageUrl = `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}`;
    const { width } = useWindowDimensions();
    const [height, setHeight] = useState(0);

    Image.getSize(imageUrl, (w, h) => {
        setHeight(h * ((width / 3 - 10) / w));
    });

    return (
        <Pressable onPress={onPress}>
            <Card style={styles.container} elevation={0}>
                <Card.Cover style={{ height: height }} resizeMode={'contain'} resizeMethod={'resize'}
                            source={{ uri: imageUrl }} />

                {isDeleteMode && isSelected &&
                    <View style={styles.selectItem}>
                        <MaterialCommunityIcons name={'check'} size={48} color={PRIMARY.DEFAULT} />
                    </View>
                }
            </Card>
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
        backgroundColor: WHITE
    },
    selectItem: {
        backgroundColor: 'rgba(107,114,128,0.7)',
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
