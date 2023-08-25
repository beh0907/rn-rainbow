import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import { WHITE } from '../../Colors';
import { Card, Divider, Title } from 'react-native-paper';
import AutoHeightImage from 'react-native-auto-height-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const CarouselItem = memo(({ room }) => {
    const navigation = useNavigation();

    const pressItem = ({ roomNum }) => {
        navigation.navigate(MainRoutes.ROOM_TAB, {
            roomNum
        });
    };

    return (
        <Card style={[styles.container]} elevation={1} onPress={() => pressItem(room)}>
            <Card.Cover style={styles.image}
                        source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} />
            <Card.Content style={styles.overlayTitle}>
                {/*반려동물 이름 및 나이*/}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Title numberOfLines={1} style={styles.title}>{room.name}</Title>
                    <Title style={styles.title}> ({room.age})</Title>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={styles.imageContainer}>
                        <AutoHeightImage width={room.gender === 1 ? 20 : 14}
                                         source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />

                        <Divider horizontalInset style={styles.separator} />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={'eye'} size={20} color={'white'} style={styles.icon} />
                            <Title style={styles.description}>{room.views}</Title>
                        </View>

                        <Divider horizontalInset style={styles.separator} />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={'comment-text'} size={18} color={'white'}
                                                    style={styles.icon} />
                            <Title style={styles.description}>{room.comments}</Title>
                        </View>
                    </View>
                </View>
            </Card.Content>

            <View style={styles.overlayNum}>
                <Text style={{ color: 'white' }}>No. {String(room.roomNum).padStart(4, '0')}</Text>
            </View>

            {/*<View style={styles.overlayViews}>*/}
            {/*    <MaterialCommunityIcons name={"account"} size={16} color={PRIMARY.DEFAULT} style={{alignItems: "center"}}/>*/}
            {/*    <Title style={styles.description}>{room.views}</Title>*/}
            {/*</View>*/}
        </Card>
    );
});


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        flex: 1,
        marginBottom: 10
    },
    image: {
        height: '100%'
    },
    overlayTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    overlayViews: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 8,
        flexDirection: 'row'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    description: {
        fontSize: 14,
        color: 'white'
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    separator: {
        height: 16,
        width: 1,
        marginHorizontal: 8,
        backgroundColor: WHITE
    },
    overlayNum: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 8,
        margin: 8,
        borderRadius: 8
    },
    icon: {
        marginEnd: 4
    }
});

export default CarouselItem;
