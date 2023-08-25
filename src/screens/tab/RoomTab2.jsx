import { MainRoutes, RoomRoutes } from '../../navigations/Routes';
import { GRAY, PRIMARY } from '../../Colors';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { readRoom } from '../../api/Room';
import { useRoomState } from '../../contexts/RoomContext';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import HeaderRight from '../../components/view/HeaderRight';
import { useUserState } from '../../contexts/UserContext';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import * as PreferenceStore from '../../utils/PreferenceStore';
import { Text } from 'react-native-paper';
import Constants from 'expo-constants';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import GalleryScreen from '../room/GalleryScreen';
import MemoryScreen from '../room/MemoryScreen';
import CommentScreen from '../room/CommentScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useDialogState } from '../../contexts/DialogContext';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const HEADER_HEIGHT = 250;

const RoomTab2 = () => {
    const navigation = useNavigation();

    //컨텍스트 데이터
    const [room, setRoom] = useRoomState();
    const [user] = useUserState();

    const [, setSnackbar] = useSnackBarState();
    const [, setDialog] = useDialogState();

    //라우터 파라미터
    const { params } = useRoute();
    const { roomNum } = params;

    //필요 데이터 로드 완료 여부 로딩을 종료시킨다
    const [isReady, setIsReady] = useState(false);

    //북마크 여부 체크
    const [isBookMark, setIsBookMark] = useState(false);

    const [galleryIcon, setGalleryIcon] = useState('view-grid');
    const [memoryIcon, setMemoryIcon] = useState('video-outline');
    const [commentIcon, setCommentIcon] = useState('comment-text-outline');


    useLayoutEffect(() => {
        (async () => {
            try {
                //추모관에 필요한 정보들을 한꺼번에 불러온다
                setRoom(await readRoom(roomNum));
                setIsReady(true);
            } catch (e) {
                setDialog({
                    title: '통신 에러',
                    message: '추모관 정보를 읽어 오는데 실패하였습니다.',
                    onPress: async () => {
                        navigation.goBack();
                    },
                    visible: true,
                    isConfirm: false
                });
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

    const roomHeader = () => {
        return (
            <View style={styles.header}>
                <View style={styles.petInfoTextContainer}>
                    <Image style={[{ width: 48, height: 48, borderRadius: 24 }]}
                           cachePolicy={'memory'}
                           source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')} />

                    {/*<AvatarImage*/}
                    {/*    source={room.image ? { uri: `${BASE_URL_FILE}${room.id}/${room.roomNum}/profile/${room.image}` } : require('../../../assets/background/bg_temp.jpg')}*/}
                    {/*    size={48} />*/}
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
            </View>
        );
    };

    return (
        isReady ?
            <Tabs.Container
                onIndexChange={(index) => {
                    setGalleryIcon(index === 0 ? 'view-grid' : 'view-grid-outline');
                    setMemoryIcon(index === 1 ? 'video' : 'video-outline');
                    setCommentIcon(index === 2 ? 'comment-text' : 'comment-text-outline');
                }}
                allowHeaderOverscroll
                // headerHeight={HEADER_HEIGHT}
                pointerEvents={'box-none'}
                renderHeader={roomHeader}
                renderTabBar={props =>
                    <MaterialTabBar {...props}
                                    activeColor={PRIMARY.DEFAULT}
                                    inactiveColor={GRAY.DEFAULT}
                                    style={{ backgroundColor: 'white', color: PRIMARY.DEFAULT }}
                                    indicatorStyle={{ backgroundColor: PRIMARY.DEFAULT }} />}
            >
                <Tabs.Tab name={RoomRoutes.GALLERY}
                          label={(props) => <MaterialCommunityIcons name={galleryIcon} size={24}
                                                                    color={PRIMARY.DEFAULT} />}>
                    <GalleryScreen />
                </Tabs.Tab>
                <Tabs.Tab name={RoomRoutes.MEMORY}
                          label={(props) => <MaterialCommunityIcons name={memoryIcon} size={24}
                                                                    color={PRIMARY.DEFAULT} />}>
                    <MemoryScreen />
                </Tabs.Tab>
                <Tabs.Tab name={RoomRoutes.COMMENT}
                          label={(props) => <MaterialCommunityIcons name={commentIcon} size={24}
                                                                    color={PRIMARY.DEFAULT} />}>
                    <CommentScreen />
                </Tabs.Tab>
            </Tabs.Container>

            // <Tab.Navigator
            //     style={{ flex: 1 }}
            //     initialLayout={{ width: Dimensions.get('window').width }}
            //     screenOptions={({ route }) => ({
            //         // tabBarStyle: { elevation: 0, shadowOpacity: 0 },
            //         lazy: false,
            //         tabBarIndicatorStyle: { backgroundColor: PRIMARY.DEFAULT },
            //         swipeEnabled: true,
            //         tabBarShowLabel: false,
            //         tabBarIcon: ({ focused }) => {
            //             let iconName;
            //
            //             switch (route.name) {
            //                 case RoomRoutes.HOME:
            //                     iconName = 'home';
            //                     break;
            //                 case RoomRoutes.GALLERY:
            //                     iconName = 'view-grid';
            //                     break;
            //                 case RoomRoutes.MEMORY:
            //                     iconName = 'video';
            //                     break;
            //                 case RoomRoutes.COMMENT:
            //                     iconName = 'comment-text';
            //                     break;
            //                 default:
            //                     break;
            //             }
            //
            //             if (!focused) iconName += '-outline';
            //
            //             // You can return any component that you like here!
            //             return <MaterialCommunityIcons name={iconName} size={24} color={PRIMARY.DEFAULT} />;
            //         }
            //     })}>
            //     {/*<Tab.Screen name={RoomRoutes.HOME} component={RoomScreen} />*/}
            //     <Tab.Screen name={RoomRoutes.GALLERY} component={GalleryScreen} />
            //     <Tab.Screen name={RoomRoutes.MEMORY} component={MemoryScreen} />
            //     <Tab.Screen name={RoomRoutes.COMMENT} component={CommentScreen} />
            //     {/*<Tab.Screen name={RoomRoutes.THREE_DIMENSION} component={ThreeDimensionScreen} />*/}
            // </Tab.Navigator>
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
        // flexDirection: 'row',
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

export default RoomTab2;
