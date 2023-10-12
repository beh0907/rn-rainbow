import { MainRoutes, RoomRoutes } from '../../navigations/Routes';
import { GRAY, PRIMARY } from '../../Colors';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { readRoom } from '../../api/Room';
import { useRoomState } from '../../contexts/RoomContext';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import HeaderRight from '../../components/view/HeaderRight';
import { useUserState } from '../../contexts/UserContext';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import * as PreferenceStore from '../../utils/PreferenceStore';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import GalleryScreen from '../room/GalleryScreen';
import MemoryScreen from '../room/MemoryScreen';
import CommentScreen from '../room/CommentScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDialogState } from '../../contexts/DialogContext';
import RoomHeader from '../../components/view/RoomHeader';
import { DIALOG_MODE } from '../../components/message/CustomDialog';

const RoomTab = () => {
    const navigation = useNavigation();
    const tabRef = useRef(null);

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

    const [currentIndex, setCurrentIndex] = useState(0);

    useLayoutEffect(() => {
        (async () => {
            try {
                setIsReady(false);
                setDialog({
                    message: '정보를 읽고 있습니다......',
                    visible: true,
                    mode: DIALOG_MODE.LOADING
                });

                //추모관에 필요한 정보들을 한꺼번에 불러온다
                setRoom(await readRoom(roomNum));

                setDialog({ visible: false });
                setIsReady(true);
            } catch (e) {
                setDialog({
                    title: '통신 에러',
                    message: '추모관 정보를 읽어 오는데 실패하였습니다.',
                    onPress: async () => {
                        navigation.goBack();
                    },
                    visible: true,
                    mode: DIALOG_MODE.ALERT
                });
            }
        })();
    }, [roomNum, readRoom]);

    useLayoutEffect(() => {
        (async () => {

            console.log('user.id : ', user.id);
            console.log('room.id : ', room.id);

            /**탭 네비게이션 설정*/
            navigation.setOptions({
                headerTitle: 'Room No.' + String(roomNum).padStart(4, '0'),
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerRight: () => {
                    return (
                        user.id === room.id
                            ? // 내가 개설한 추모관이라면 방 설정
                            <HeaderRight disabled={false} name={'cog'} onPress={() => {
                                navigation.navigate(MainRoutes.ROOM_UPDATE, {
                                    room
                                });
                            }} />
                            : // 아니라면 즐겨찾기
                            <HeaderRight disabled={false} color={isBookMark ? PRIMARY.DEFAULT : GRAY.DEFAULT}
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
    }, [roomNum, isBookMark, user, room, setSnackbar, navigation, HeaderRight]);

    useLayoutEffect(() => {
        (async () => {
            setIsBookMark(await PreferenceStore.isBookMark(roomNum));
        })();
    }, []);

    return (
        isReady ?
            <Tabs.Container
                ref={tabRef}
                initialTabName={RoomRoutes.GALLERY}
                onIndexChange={(index) => setCurrentIndex(index)}
                allowHeaderOverscroll={true}
                // revealHeaderOnScroll // 위쪽으로 스크롤 할 때 헤더를 표시
                // headerHeight={268}
                renderHeader={() => <RoomHeader room={room} />}
                lazy
                cancelLazyFadeIn
                renderTabBar={props =>
                    <MaterialTabBar {...props}
                                    activeColor={PRIMARY.DEFAULT}
                                    inactiveColor={GRAY.DEFAULT}
                                    style={{ backgroundColor: 'white', color: PRIMARY.DEFAULT }}
                                    indicatorStyle={{ backgroundColor: PRIMARY.DEFAULT }} />}
            >
                <Tabs.Tab name={RoomRoutes.GALLERY}
                          label={(props) => {
                              return <MaterialCommunityIcons
                                  name={currentIndex === 0 ? 'view-grid' : 'view-grid-outline'} size={24}
                                  color={PRIMARY.DEFAULT} />;
                          }}>
                    <GalleryScreen />
                </Tabs.Tab>
                <Tabs.Tab name={RoomRoutes.MEMORY}
                          label={(props) => {
                              return <MaterialCommunityIcons name={currentIndex === 1 ? 'video' : 'video-outline'}
                                                             size={24}
                                                             color={PRIMARY.DEFAULT} />;
                          }}>
                    <MemoryScreen />
                </Tabs.Tab>
                <Tabs.Tab name={RoomRoutes.COMMENT}
                          label={(props) => {
                              return <MaterialCommunityIcons
                                  name={currentIndex === 2 ? 'comment-text' : 'comment-text-outline'} size={24}
                                  color={PRIMARY.DEFAULT} />;
                          }}>
                    <CommentScreen />
                </Tabs.Tab>
            </Tabs.Container>
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
    }
});

export default RoomTab;
