import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Subheading, Text, Title } from 'react-native-paper';
import { BASE_URL_FILE } from '@env';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../../Colors';
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

                    <View style={{ flex: 1 }}>
                        <Card.Cover style={styles.image}
                                    source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} />
                        <View style={styles.overlayTitle}>
                            <Text style={{ color: 'white' }}>No. {String(room.roomNum).padStart(4, '0')}</Text>
                        </View>
                    </View>


                    <Card.Content style={styles.titleContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Subheading style={styles.title}>{room.name} ({room.age})</Subheading>
                            <AutoHeightImage width={room.gender === 1 ? 20 : 14}
                                             source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />
                        </View>

                        <Text style={styles.description}>{room.date}</Text>
                        <View style={styles.imageContainer}>

                            <AutoHeightImage width={room.gender === 1 ? 20 : 14}
                                             source={room.gender === 1 ? require('../../../assets/icon/ic_male.png') : require('../../../assets/icon/ic_female.png')} />

                            <View style={styles.separator} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={'eye'} size={16} color={PRIMARY.DEFAULT}
                                                        style={{ alignItems: 'center' }} />
                                <Title style={styles.description}>{room.views}</Title>
                            </View>

                            <View style={styles.separator} />

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={'eye'} size={16} color={PRIMARY.DEFAULT}
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
        marginBottom: 10,
        marginHorizontal: 20,
        backgroundColor: 'white'
    },
    image: {
        flex: 1,
        // width: '100%',
        height: '100%'
    },
    titleContainer: {
        flex: 1,
        paddingVertical: 5
    },
    title: {
        fontWeight: 'bold'
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
        borderRadius: 16,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        alignItems: 'center'
    },
    separator: {
        height: 16,
        width: 1,
        marginHorizontal: 8,
        backgroundColor: GRAY.DARK
    }
});

export default VerticalListRoomItem;
