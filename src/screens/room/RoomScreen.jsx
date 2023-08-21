import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Surface, Text } from 'react-native-paper';
import { useRoomState } from '../../contexts/RoomContext';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const RoomScreen = () => {
    const [room] = useRoomState();

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.petInfoTextContainer}>
                    <MaterialCommunityIcons name={'dog'} size={36} color={PRIMARY.DEFAULT} />
                    <Text variant={'headlineMedium'} style={styles.petName}>{room.name}</Text>
                </View>

                {/*메인 이미지*/}
                <Surface elevation={3} style={{ marginTop: 16, marginBottom: 32 }}>
                    <Image style={styles.petImage}
                           source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} />
                </Surface>

                {/*정보*/}
                <View>
                    {/*나이*/}
                    <View style={styles.petDataContainer}>
                        <Text style={styles.petDataTitle} variant={'titleLarge'}>Age</Text>
                        <Text style={styles.petDataText} variant={'bodyLarge'}>{room.age}</Text>
                    </View>

                    {/*성별*/}
                    <View style={styles.petDataContainer}>
                        <Text style={styles.petDataTitle} variant={'titleLarge'}>Sex</Text>
                        <Text style={styles.petDataText}
                              variant={'bodyLarge'}>{room.age === 1 ? 'Male' : 'Female'}</Text>

                    </View>

                    {/*떠나보낸 날짜*/}
                    <View style={[styles.petDataContainer, { marginBottom: 0 }]}>
                        <Text style={styles.petDataTitle} variant={'titleLarge'}>Date</Text>
                        <Text style={styles.petDataText} variant={'bodyLarge'}>~ {room.date}</Text>
                    </View>
                </View>

                {/*구분선*/}
                <Divider style={styles.divider} />

                {/*인삿말*/}
                <View style={styles.messageContainer}>
                    <Text variant={'headlineMedium'} style={styles.messageTitle}>인사말</Text>
                    <Text style={styles.messageText}>
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                        {room.content}{room.content}{room.content}{room.content}{room.content}{room.content}{room.content}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: WHITE
    },
    petImage: {
        width: '100%',
        height: 250
    },
    petInfoTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    petName: {
        fontWeight: 'bold',
        marginStart: 10
    },
    petDetails: {
        fontSize: 16,
        color: 'gray'
    },
    divider: {
        height: 1,
        backgroundColor: GRAY.LIGHT,
        marginVertical: 32
    },
    petDataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    petDataTitle: {
        fontWeight: 'bold',
        color: GRAY.DARK,
        width: 75
    },
    petDataText: {
        color: GRAY.DEFAULT
    },
    messageContainer: {},
    messageTitle: {
        fontWeight: 'bold',
        marginBottom: 8
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24
    }
});

export default RoomScreen;
