import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { GRAY, PRIMARY } from '../../Colors';
import { RoomRoutes } from '../../navigations/Routes';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const RoomHeader = ({ room }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View style={styles.petInfoTextContainer}>
                <Pressable onPress={() => room.image && navigation.navigate(RoomRoutes.IMAGE_CONTROL, {url : `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}?version=${room.updateDate}`})}>
                    <AvatarImage
                        source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}?version=${room.updateDate}` } : require('../../../assets/background/bg_temp.jpg')}
                        size={72} />
                </Pressable>
                <Text variant={'headlineSmall'} style={styles.petName}>{room.name}</Text>
            </View>

            <Text style={[styles.petDataText, { marginVertical: 20 }]} variant={'bodyLarge'}>{room.content}</Text>

            {/*정보*/}
            <View style={{ flexDirection: 'row' }}>
                {/*나이*/}
                <View style={styles.petDataContainer}>
                    <Text style={styles.petDataTitle} variant={'titleMedium'}>Age</Text>
                    <Text style={styles.petDataText} variant={'bodyLarge'}>{room.age}</Text>
                </View>


                {/*성별*/}
                <View style={styles.petDataContainer}>
                    <Text style={styles.petDataTitle} variant={'titleMedium'}>Sex</Text>
                    <Text style={styles.petDataText}
                          variant={'bodyLarge'}>{room.age === 1 ? 'Male' : 'Female'}</Text>

                </View>

                {/*떠나보낸 날짜*/}
                <View style={[styles.petDataContainer, { marginBottom: 0 }]}>
                    <Text style={styles.petDataTitle} variant={'titleMedium'}>Date</Text>
                    <Text style={styles.petDataText} variant={'bodyLarge'}>~{room.date}</Text>
                </View>
            </View>

            <Button
                mode='outlined'
                size={24}
                iconColor={PRIMARY.DEFAULT}
                icon={'logout-variant'}
                onPress={() => {
                    navigation.navigate(RoomRoutes.THREE_DIMENSION);
                }}
            >
                3D 테스트
            </Button>

        </View>
    );
};

const styles = StyleSheet.create({
    petImage: {
        width: '100%',
        height: 200
    },
    petInfoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    petName: {
        fontWeight: 'bold',
        marginStart: 10,
        flex: 1
    },
    petDataContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10
    },
    petDataTitle: {
        fontWeight: 'bold',
        color: PRIMARY.DEFAULT
    },
    petDataText: {
        color: GRAY.DEFAULT
    },
    header: {
        // height: HEADER_HEIGHT,
        width: '100%',
        padding: 16
    }
});

export default RoomHeader;
