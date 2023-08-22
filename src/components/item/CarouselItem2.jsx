import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const CarouselItem2 = memo(({ item }) => {

    return (
        <View
            style={styles.item}>

            <Image
                source={item.image ? { uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/profile/${item.image}` } : require('../../../assets/background/bg_temp.jpg')}
                style={styles.imageBackground} />
            <View style={styles.lowerContainer}>
                <Text style={styles.titleText}>{item.name} ({item.age})</Text>
                <Text style={styles.contentText}>{item.content}</Text>
            </View>
        </View>
    );
});


const styles = StyleSheet.create({
    item: {
        borderWidth: 2,
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        borderColor: 'white',
        elevation: 3
    },
    imageBackground: {
        flex: 2,
        backgroundColor: '#EBEBEB',
        borderWidth: 5,
        borderColor: 'white'
    },
    rightTextContainer: {
        marginLeft: 'auto',
        marginRight: -2,
        backgroundColor: 'rgba(49, 49, 51,0.5)',
        padding: 3,
        marginTop: 3,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    rightText: { color: 'white' },
    lowerContainer: {
        flex: 1,
        margin: 10
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18
    },
    contentText: {
        marginTop: 10,
        fontSize: 12
    }
});

export default CarouselItem2;
