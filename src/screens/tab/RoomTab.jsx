import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RoomRoutes } from '../../navigations/Routes';
import CommentScreen from '../room/CommentScreen';
import RoomScreen from '../room/RoomScreen';
import GalleryScreen from '../room/GalleryScreen';
import MemoryScreen from '../room/MemoryScreen';
import { PRIMARY } from '../../Colors';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { readRoom } from '../../api/Room';
import { useRoomState } from '../../contexts/RoomContext';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

const RoomTab = () => {
    const navigation = useNavigation();
    const [room, setRoom] = useRoomState();
    const { params } = useRoute();
    const { roomNum } = params;

    //필요 데이터 로드 완료 여부 로딩을 종료시킨다
    const [isReady, setIsReady] = useState(false);

    useLayoutEffect(() => {
        (async () => {
            /**탭 네비게이션 설정*/
            navigation.setOptions({
                headerTitle: 'Room No.' + String(roomNum).padStart(4, '0'),
                headerShadowVisible: false,
                headerTitleAlign: 'center'
            });

            /**RoomNum 기반 방 정보 가져오기*/
            await readRoom(roomNum)
                .then(value => {
                    console.log('밸류', value);
                    setRoom(value);
                    setIsReady(true)
                })
                .catch(e => {
                    Alert.alert('통신 에러', '추모관 정보를 읽어 오는데 실패하였습니다', [{
                        text: '확인',
                        onPress: () =>  {
                            navigation.goBack()
                        }
                    }]);
                });
        })();
    }, [navigation, roomNum, setRoom, readRoom]);

    return (
        isReady ?
            <Tab.Navigator screenOptions={{
                tabBarStyle: { elevation: 0, shadowOpacity: 0 },
                tabBarIndicatorStyle: { backgroundColor: PRIMARY.DEFAULT },
                tabBarAndroidRipple: false
            }}>
                <Tab.Screen name={RoomRoutes.HOME} component={RoomScreen} />
                <Tab.Screen name={RoomRoutes.COMMENT} component={CommentScreen} />
                <Tab.Screen name={RoomRoutes.GALLERY} component={GalleryScreen} />
                <Tab.Screen name={RoomRoutes.MEMORY} component={MemoryScreen} />
            </Tab.Navigator>
            :
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={PRIMARY.DEFAULT} />
                {/*<Text>추모관 정보를 읽고 있습니다</Text>*/}
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:"center"
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default RoomTab;
