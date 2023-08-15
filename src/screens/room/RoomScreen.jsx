import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-paper';
import { useRoomState } from '../../contexts/RoomContext';
import { WHITE } from '../../Colors';
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;


const RoomScreen = () => {
    const [room] = useRoomState();

    return (
        <View style={styles.container}>
            {/* Pet Information */}
            <View style={styles.petInfoContainer}>
                <Avatar.Image
                    size={100}
                    source={{ uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` }}
                />
                <View style={styles.petInfoTextContainer}>
                    <Text style={styles.petName}>{room.name}</Text>
                    <Text style={styles.petDetails}>{room.age} years old, {room.gender === 1 ? 'Male' : 'Female'}</Text>
                </View>
            </View>
            <Divider style={styles.divider} />

            {/*날짜*/}
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>떠나보낸 날짜 : {room.date}</Text>
            </View>
            <Divider style={styles.divider} />

            {/*인삿말*/}
            <View style={styles.messageContainer}>
                <Text style={styles.messageTitle}>인사말</Text>
                <Text style={styles.messageText}>
                    {room.content}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: WHITE
    },
    petInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    petInfoTextContainer: {
        marginLeft: 16
    },
    petName: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    petDetails: {
        fontSize: 16,
        color: 'gray'
    },
    divider: {
        height: 1,
        backgroundColor: 'gray',
        marginVertical: 16
    },
    dateContainer: {
        marginBottom: 16
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    messageContainer: {},
    messageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24
    }
});

export default RoomScreen;
