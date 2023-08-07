import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Paragraph, Text, Title } from 'react-native-paper';
import { BASE_URL_FILE } from '@env';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY } from '../../Colors';
import AutoHeightImage from 'react-native-auto-height-image';

const VerticalListRoomItem = memo(({ room }) => {
    const navigation = useNavigation();

    const pressItem = ({ roomNum }) => {
        navigation.navigate(MainRoutes.ROOM_TAB, {
            roomNum
        });
    };

    return (
        <Pressable onPress={() => pressItem(room)}>
            <Card key={room.id} style={[styles.container]} elevation={1}>

                <View style={{ flexDirection: 'row' }}>
                    <Card.Cover style={styles.image}
                                source={{ uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` }} />

                    <Card.Content style={styles.titleContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Title style={styles.title}>{room.name} ({room.age})</Title>
                            <AutoHeightImage width={room.gender === 1 ? 20 : 14}
                                             source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />
                        </View>

                        <Text style={styles.description}>{room.date}</Text>
                        <View style={styles.imageContainer}>
                            <Text variant={'bodyMedium'}>{'No.' + String(room.roomNum).padStart(4, '0')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={'account'} size={16} color={PRIMARY.DEFAULT}
                                                        style={{ alignItems: 'center' }} />
                                <Title style={styles.description}>{room.views}</Title>
                            </View>
                        </View>
                    </Card.Content>
                </View>

            </Card>
        </Pressable>
    );
});

VerticalListRoomItem.displayName = 'VerticalListRoomItem';

VerticalListRoomItem.propTypes = {
    room: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        marginBottom: 20,
        marginHorizontal:20,
        backgroundColor:'white'
    },
    image: {
        flex: 1,
        // width: '100%'
        height: 100
    },
    titleContainer: {
        flex: 1
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 14
    },
    icon: {
        // width: 14,
        // height: 14
    },
    imageContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default VerticalListRoomItem;
