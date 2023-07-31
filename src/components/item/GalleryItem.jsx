import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { BASE_URL_FILE } from '@env';
import { Card } from 'react-native-paper';

const GalleryItem = ({ item, onPress }) => {
    const imageUrl = `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}`;
    const { width } = useWindowDimensions();
    const [height, setHeight] = useState(0);

    Image.getSize(imageUrl, (w, h) => {
        setHeight(h * ((width / 3 - 10) / w));
    });

    return (
        <Pressable onPress={onPress}>
            <Card style={styles.container} elevation={5}>
                <Card.Cover style={{height:height}} resizeMode={'contain'} resizeMethod={'resize'}
                            source={{ uri: imageUrl }} />
            </Card>


            {/*<Card style={[styles.container]} elevation={1}>*/}
            {/*    <Card.Cover style={styles.image}*/}
            {/*                source={{ uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}` }} />*/}

            {/*</Card>*/}
        </Pressable>
    );
};

GalleryItem.propTypes = {
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        margin: 5
    }
});

export default GalleryItem;
