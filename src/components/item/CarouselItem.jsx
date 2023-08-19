import React, { forwardRef, memo } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MainRoutes } from '../../navigations/Routes';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const CarouselItem = memo(forwardRef(({ item, index, currentIndex }, ref) => {
    const navigation = useNavigation();

    const pressItem = ({ roomNum }) => {
        //현재 선택중인 아이템을 터치했을 때
        if (index === currentIndex) {
            navigation.navigate(MainRoutes.ROOM_TAB, {
                roomNum
            });
        } else { //아니라면 해당 위치로 스크롤 이동
            ref.current.scrollToIndex(index);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={() => pressItem(item)}>

            <Image source={item.image ? { uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/profile/${item.image}` } : require('../../../assets/background/bg_temp.jpg')}
                             style={styles.imageBackground}/>

            {/*<ImageBackground source={item.image ? { uri: `${BASE_URL_FILE}${item.id}/${item.roomNum}/profile/${item.image}` } : require('../../../assets/background/bg_temp.jpg')}*/}
            {/*                 style={styles.imageBackground}>*/}
            {/*    <View style={styles.rightTextContainer}>*/}
            {/*        <Text style={styles.rightText}>{item.views}</Text>*/}
            {/*    </View>*/}
            {/*</ImageBackground>*/}
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

export default CarouselItem;
