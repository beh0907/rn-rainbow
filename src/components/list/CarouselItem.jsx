import React, {forwardRef, memo} from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {BASE_URL_FILE} from "@env"

const CarouselItem = memo(forwardRef(({item, index}, ref) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={() => {
                ref.current.scrollToIndex(index);
            }}>
            <ImageBackground source={{uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/profile/${item.image}`}}
                             style={styles.imageBackground}>
                <View style={styles.rightTextContainer}>
                    <Text style={styles.rightText}>{item.views}</Text>
                </View>
            </ImageBackground>
            <View style={styles.lowerContainer}>
                <Text style={styles.titleText}>{item.name} ({item.age})</Text>
                <Text style={styles.contentText}>{item.content}</Text>
            </View>
        </TouchableOpacity>
    );
}));


const styles = StyleSheet.create({
    item: {
        borderWidth: 2,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        borderColor: 'white',
        elevation: 3,
    },
    imageBackground: {
        flex: 2,
        backgroundColor: '#EBEBEB',
        borderWidth: 5,
        borderColor: 'white',
    },
    rightTextContainer: {
        marginLeft: 'auto',
        marginRight: -2,
        backgroundColor: 'rgba(49, 49, 51,0.5)',
        padding: 3,
        marginTop: 3,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    rightText: {color: 'white'},
    lowerContainer: {
        flex: 1,
        margin: 10,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    contentText: {
        marginTop: 10,
        fontSize: 12,
    },
});

export default CarouselItem;
