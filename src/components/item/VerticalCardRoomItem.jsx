import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Text, Title } from 'react-native-paper';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import AutoHeightImage from 'react-native-auto-height-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY } from '../../Colors';
import Constants from 'expo-constants';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const VerticalCardRoomItem = memo(({ room }) => {
    console.log('룸 카드뷰', room);
    const navigation = useNavigation();

    const pressItem = ({ roomNum }) => {
        navigation.navigate(MainRoutes.ROOM_TAB, {
            roomNum
        });
    };

    return (
        <Pressable onPress={() => pressItem(room)}>
            <Card key={room.id} style={[styles.container]} elevation={1}>


                <Card.Cover style={styles.image}
                            source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} />
                <Card.Content style={styles.overlayTitle}>

                    {/*반려동물 이름 및 나이*/}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Title numberOfLines={1} style={styles.title}>{room.name}</Title>
                        <Title style={styles.title}> ({room.age})</Title>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/*<AutoHeightImage width={room.gender === 1 ? 20 : 14}*/}
                        {/*                 source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />*/}
                        <Text style={styles.description}>{room.date}</Text>

                        <View style={styles.imageContainer}>
                            <AutoHeightImage width={room.gender === 1 ? 16 : 12}
                                             source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />

                            <View style={styles.separator} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={'eye'} size={16} color={'white'} style={styles.icon} />
                                <Title style={styles.description}>{room.views}</Title>
                            </View>

                            <View style={styles.separator} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={'comment-text'} size={14} color={'white'}
                                                        style={styles.icon} />
                                <Title style={styles.description}>{room.comments}</Title>
                            </View>
                        </View>
                    </View>
                </Card.Content>

                <View style={styles.overlayUser}>
                    {
                        room.userImage ?
                            <AvatarImage source={{ uri: `${BASE_URL_FILE}${room.id}/profile.jpg` }} size={24} />
                            : <AvatarText label={room.userNickName.charAt(0)} Text size={24} />
                    }
                    <Text numberOfLines={1}
                          style={{ marginLeft: 5, color: 'white', width: 64 }}>{room.userNickName}</Text>
                </View>

                <View style={styles.overlayNum}>
                    <Text style={{ color: 'white' }}>No. {String(room.roomNum).padStart(4, '0')}</Text>
                </View>

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
        marginBottom: 10,
        marginHorizontal: 20
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
        backgroundColor: GRAY.LIGHT
    },
    overlayUser: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 8,
        margin: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    overlayNum: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 8,
        margin: 8,
        borderRadius: 8
    },
    icon: {
        marginEnd: 4
    }
});

export default VerticalCardRoomItem;
