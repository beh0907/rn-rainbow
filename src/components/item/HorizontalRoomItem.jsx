import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Text, Title } from 'react-native-paper';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const HorizontalRoomItem = memo(({ room }) => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const pressItem = ({ roomNum }) => {
        navigation.navigate(MainRoutes.ROOM_TAB, {
            roomNum
        });
    };

    return (
        <Pressable onPress={() => pressItem(room)}>
            <Card key={room.id} style={[styles.container, { width: width / 2, borderRadius: 36 }]}>
                {/*<View style={styles.overlayNum}>*/}
                {/*    <Text style={{ color: 'white' }}>No. {String(room.roomNum).padStart(4, '0')}</Text>*/}
                {/*</View>*/}

                <Card.Cover style={styles.image}
                            source={{ uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` }} />
                <Card.Content style={styles.overlayTitle}>
                    <Title style={styles.title}>{room.name} ({room.age})</Title>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={styles.icon}
                               source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />
                        <Text style={styles.description}>{room.date}</Text>
                        {/*<Paragraph style={styles.description}>{room.date}({room.age})</Paragraph>*/}
                    </View>
                </Card.Content>


            </Card>
        </Pressable>
    );
});

HorizontalRoomItem.displayName = 'HorizontalRoomItem';

HorizontalRoomItem.propTypes = {
    room: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2
    },
    image: {
        width: '100%',
        height: 200
    },
    overlayTitle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    overlayNum: {
        position: 'absolute',
        top: 0,
        left: 0,
        // backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backgroundColor: 'green',
        padding: 8
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    description: {
        marginStart: 10,
        fontSize: 14,
        color: 'white'
    },
    icon: {
        width: 16,
        height: 20
    }
});

export default HorizontalRoomItem;
