import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Text, Title } from 'react-native-paper';
import { BASE_URL_FILE } from '@env';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import AutoHeightImage from 'react-native-auto-height-image';

const VerticalCardRoomItem = memo(({ room }) => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();

    console.log('나의 아이템?', room);

    const pressItem = ({ roomNum }) => {
        navigation.navigate(MainRoutes.ROOM_TAB, {
            roomNum
        });
    };

    return (
        <Pressable onPress={() => pressItem(room)}>
            <Card key={room.id} style={[styles.container]} elevation={1}>
                {/*<Card.Title*/}
                {/*    title="Card Title"*/}
                {/*    left={(props) => <AvatarText label={"CARD"} size={36} />}*/}
                {/*/>*/}
                <Card.Cover style={styles.image}
                            source={{ uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` }} />
                {/*source={{uri: `${BASE_URL_FILE_AWS}${room.id}/${room.roomNum}/profile/${room.image}`}}/>*/}
                <Card.Content style={styles.overlayTitle}>
                    <Title style={styles.title}>{room.name} ({room.age})</Title>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AutoHeightImage width={room.gender === 1 ? 20 : 14}
                                         source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />
                        <Text style={styles.description}>{room.date}</Text>
                    </View>
                </Card.Content>

                {/*<View style={styles.overlayViews}>*/}
                {/*    <MaterialCommunityIcons name={"account"} size={16} color={PRIMARY.DEFAULT} style={{alignItems: "center"}}/>*/}
                {/*    <Title style={styles.description}>{room.views}</Title>*/}
                {/*</View>*/}
            </Card>
        </Pressable>
    );
});

VerticalCardRoomItem.displayName = 'VerticalCardRoomItem';

VerticalCardRoomItem.propTypes = {
    room: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        flex: 1,
        marginBottom: 20
    },
    image: {
        width: '100%'
        // height: 200,
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
        marginStart: 10,
        fontSize: 14,
        color: 'white'
    }
});

export default VerticalCardRoomItem;
