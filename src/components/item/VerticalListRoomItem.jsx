import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Subheading, Text, Title } from 'react-native-paper';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../../Colors';
import AutoHeightImage from 'react-native-auto-height-image';
import Constants from 'expo-constants';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import { Image } from 'expo-image';

const { BASE_URL_FILE } = Constants.expoConfig.extra;


const VerticalListRoomItem = memo(({ room }) => {
    console.log('룸 리스트', room);
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

                    <View style={{ flex: 1 }}>
                        <Image
                            style={styles.image}
                            source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} />

                        {/*<Card.Cover style={styles.image}*/}
                        {/*            source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} />*/}
                        <View style={styles.overlayTitle}>
                            <Text style={{ color: 'white' }}>No. {String(room.roomNum).padStart(4, '0')}</Text>
                        </View>
                    </View>


                    <Card.Content style={styles.titleContainer}>

                        {/*유저 정보*/}
                        <View style={styles.userContainer}>
                            {
                                room.userImage ?
                                    <AvatarImage source={{ uri: `${BASE_URL_FILE}${room.id}/profile.jpg` }} size={24} />
                                    : <AvatarText label={room.userNickName.charAt(0)} Text size={24} />
                            }
                            <Text numberOfLines={1}
                                  style={{ marginLeft: 5 }}>{room.userNickName}</Text>
                        </View>

                        {/*반려동물 이름 및 나이*/}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:5 }}>
                            <Subheading numberOfLines={1} style={styles.title}>{room.name} </Subheading>
                            {/*<Subheading> ({room.age})</Subheading>*/}
                        </View>

                        {/*떠나보낸 날짜*/}
                        {/*<Text style={styles.description}>{room.date}</Text>*/}


                        {/*성별, 조회/댓글 수*/}
                        <View style={styles.imageContainer}>
                            <AutoHeightImage width={room.gender === 1 ? 16 : 12}
                                             source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />

                            <View style={styles.separator} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={'eye'} size={16} color={PRIMARY.DEFAULT}
                                                        style={styles.icon} />
                                <Title style={styles.description}>{room.views}</Title>
                            </View>

                            <View style={styles.separator} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={'comment-text'} size={14} color={PRIMARY.DEFAULT}
                                                        style={styles.icon} />
                                <Title style={styles.description}>{room.comments}</Title>
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
        marginVertical: 5,
        marginHorizontal: 20,
        backgroundColor: 'white'
    },
    image: {
        flex: 1,
        height: '100%',
        borderBottomRightRadius: 12,
        borderTopRightRadius: 12
    },
    titleContainer: {
        flex: 1.5,
        paddingVertical: 5,
        marginEnd: 10
    },
    title: {
        fontWeight: 'bold'
        // flex:1
    },
    description: {
        fontSize: 14
    },
    imageContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    overlayTitle: {
        position: 'absolute',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        alignItems: 'center'
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    separator: {
        height: 16,
        width: 1,
        marginHorizontal: 8,
        backgroundColor: GRAY.DARK
    },
    icon: {
        marginEnd: 4
    }
});

export default VerticalListRoomItem;
