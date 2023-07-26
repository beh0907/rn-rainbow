import React from 'react';
import PropTypes from 'prop-types';
import {Card, Text, Title} from "react-native-paper";
import {Image, Pressable, StyleSheet, View} from "react-native";
import {BASE_URL_FILE} from "@env"

const GalleryItem = ({item, index, onPress}) => {
    return (
        <Pressable onPress={onPress}>
            <Card style={[styles.container]} elevation={1}>
                <Card.Cover style={styles.image}
                            source={{uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/gallery/${item.name}`}}/>

            </Card>
        </Pressable>
    );
};

GalleryItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onPress: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        elevation: 2,
        marginBottom:10
    }
});

export default GalleryItem;
