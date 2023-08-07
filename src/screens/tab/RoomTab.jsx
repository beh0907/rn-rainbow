import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RoomRoutes } from '../../navigations/Routes';
import CommentScreen from '../room/CommentScreen';
import RoomScreen from '../room/RoomScreen';
import GalleryScreen from '../room/GalleryScreen';
import MemoryScreen from '../room/MemoryScreen';
import { GRAY, PRIMARY } from '../../Colors';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { readRoom } from '../../api/Room';
import { useRoomState } from '../../contexts/RoomContext';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import HeaderRight from '../../components/view/HeaderRight';
import { useUserState } from '../../contexts/UserContext';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import * as PreferenceStore from '../../utils/PreferenceStore';


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
            /**RoomNum 기반 방 정보 가져오기*/
            await readRoom(roomNum)
                .then(value => {
                    setRoom(value);
                    setIsReady(true);
                })
                .catch(e => {
                    Alert.alert('통신 에러', '추모관 정보를 읽어 오는데 실패하였습니다', [{
                        text: '확인',
                        onPress: () => {
                            navigation.goBack();
                        }
                    }]);
                });
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
                                console.log('방 설정');
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
    }, [navigation, roomNum, isBookMark, user, room]);

    useLayoutEffect(() => {
        (async () => {
            setIsBookMark(await PreferenceStore.isBookMark(roomNum));
        })();
    }, []);

    return (
        isReady ?
            <Tab.Navigator screenOptions={{
                tabBarStyle: { elevation: 0, shadowOpacity: 0 },
                tabBarIndicatorStyle: { backgroundColor: PRIMARY.DEFAULT },
                tabBarAndroidRipple: false,
                lazy: true,
                swipeEnabled: false
            }}>
                <Tab.Screen name={RoomRoutes.HOME} component={RoomScreen} />
                <Tab.Screen name={RoomRoutes.COMMENT} component={CommentScreen} />
                <Tab.Screen name={RoomRoutes.GALLERY} component={GalleryScreen} />
                <Tab.Screen name={RoomRoutes.MEMORY} component={MemoryScreen} />
            </Tab.Navigator>
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
