import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MainRoutes, RoomRoutes } from '../../navigations/Routes';
import CommentScreen from '../room/CommentScreen';
import RoomScreen from '../room/RoomScreen';
import GalleryScreen from '../room/GalleryScreen';
import MemoryScreen from '../room/MemoryScreen';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { readRoom } from '../../api/Room';
import { useRoomState } from '../../contexts/RoomContext';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, View } from 'react-native';
import HeaderRight from '../../components/view/HeaderRight';
import { useUserState } from '../../contexts/UserContext';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import * as PreferenceStore from '../../utils/PreferenceStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const RoomTab = () => {
    const Tab = createMaterialTopTabNavigator();
    const navigation = useNavigation();

    //컨텍스트 데이터
    const [room, setRoom] = useRoomState();
    const [user] = useUserState();
    const [, setSnackbar] = useSnackBarState();

    //라우터 파라미터
    const { params } = useRoute();
    const { roomNum } = params;

    //필요 데이터 로드 완료 여부 로딩을 종료시킨다
    const [isReady, setIsReady] = useState(false);

    //북마크 여부 체크
    const [isBookMark, setIsBookMark] = useState(false);

    useLayoutEffect(() => {
        (async () => {
            try {
                //추모관에 필요한 정보들을 한꺼번에 불러온다
                setRoom(await readRoom(roomNum));
                setIsReady(true);
            } catch (e) {
                Alert.alert('통신 에러', '추모관 정보를 읽어 오는데 실패하였습니다', [{
                    text: '확인',
                    onPress: () => {
                        navigation.goBack();
                    }
                }]);
            }
        })();
    }, [roomNum]);

    useLayoutEffect(() => {
        (async () => {
            /**탭 네비게이션 설정*/
            navigation.setOptions({
                headerTitle: 'Room No.' + String(roomNum).padStart(4, '0'),
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerRight: () => {
                    return (
                        user.id === room.id
                            ? // 내가 개설한 추모관이라면 방 설정
                            <HeaderRight name={'cog'} onPress={() => {
                                navigation.navigate(MainRoutes.ROOM_UPDATE, {
                                    room
                                });
                            }} />
                            : // 아니라면 즐겨찾기
                            <HeaderRight color={isBookMark ? PRIMARY.DEFAULT : GRAY.DEFAULT}
                                         name={isBookMark ? 'star' : 'star-outline'} onPress={() => {
                                setIsBookMark(prev => {
                                    const changeState = !prev;

                                    changeState ? PreferenceStore.addBookMark(roomNum) : PreferenceStore.removeBookMark(roomNum);

                                    setSnackbar({
                                        message: changeState ? '즐겨찾기가 등록되었습니다' : '즐겨찾기가 해제되었습니다',
                                        visible: true
                                    });
                                    return !prev;
                                });
                            }} />);
                }
            });
        })();
    }, [roomNum, isBookMark, user, room]);

    useLayoutEffect(() => {
        (async () => {
            setIsBookMark(await PreferenceStore.isBookMark(roomNum));
        })();
    }, []);

    return (
        isReady ?
            <View style={{ flex: 1 }}>

                {/*상단 메인 정보*/}
                <View style={{
                    padding: 16,
                }}>
                    <View style={styles.petInfoTextContainer}>
                        <AvatarImage source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} size={48}/>
                        <Text variant={'headlineSmall'} style={styles.petName}>{room.name}</Text>
                    </View>

                    <Text style={[styles.petDataText, {marginVertical: 20}]} variant={'bodyLarge'}>{room.content}</Text>

                    {/*정보*/}
                    <View>
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
                            <Text style={styles.petDataText} variant={'bodyLarge'}>~ {room.date}</Text>
                        </View>
                    </View>
                </View>


                <Tab.Navigator
                    style={{ flex: 1 }}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    screenOptions={({ route }) => ({
                        // tabBarStyle: { elevation: 0, shadowOpacity: 0 },
                        lazy: false,
                        tabBarIndicatorStyle: { backgroundColor: PRIMARY.DEFAULT },
                        swipeEnabled: true,
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => {
                            let iconName;

                            switch (route.name) {
                                case RoomRoutes.HOME:
                                    iconName = 'home';
                                    break;
                                case RoomRoutes.GALLERY:
                                    iconName = 'view-grid';
                                    break;
                                case RoomRoutes.MEMORY:
                                    iconName = 'video';
                                    break;
                                case RoomRoutes.COMMENT:
                                    iconName = 'comment-text';
                                    break;
                                default:
                                    break;
                            }

                            if (!focused) iconName += '-outline';

                            // You can return any component that you like here!
                            return <MaterialCommunityIcons name={iconName} size={24} color={PRIMARY.DEFAULT} />;
                        }
                    })}>
                    {/*<Tab.Screen name={RoomRoutes.HOME} component={RoomScreen} />*/}
                    <Tab.Screen name={RoomRoutes.GALLERY} component={GalleryScreen} />
                    <Tab.Screen name={RoomRoutes.MEMORY} component={MemoryScreen} />
                    <Tab.Screen name={RoomRoutes.COMMENT} component={CommentScreen} />
                    {/*<Tab.Screen name={RoomRoutes.THREE_DIMENSION} component={ThreeDimensionScreen} />*/}
                </Tab.Navigator>
            </View>
            :
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size='large' color={PRIMARY.DEFAULT} />
                {/*<Text>추모관 정보를 읽고 있습니다</Text>*/}
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
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
        marginStart: 10
    },
    petDataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    petDataTitle: {
        fontWeight: 'bold',
        color: PRIMARY.DARK,
        width: 75
    },
    petDataText: {
        color: GRAY.DEFAULT
    },
});

export default RoomTab;
