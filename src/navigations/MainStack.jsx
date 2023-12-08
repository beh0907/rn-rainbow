import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainRoutes, RoomRoutes } from './Routes';
import { WHITE } from '../Colors';
import HeaderLeft from '../components/view/HeaderLeft';
import MainTab from '../screens/tab/MainTab';
import GallerySwiperScreen from '../screens/room/GallerySwiperScreen';
import RoomRegisterScreen from '../screens/main/RoomRegisterScreen';
import RoomUpdateScreen from '../screens/main/RoomUpdateScreen';
import MemoryRegisterScreen from '../screens/room/MemoryRegisterScreen';
import RoomTab from '../screens/tab/RoomTab';
import ProfileUpdateScreen from '../screens/main/ProfileUpdateScreen';
import ThreeDimensionScreen from '../screens/room/ThreeDimensionScreen';
import ImageControlScreen from '../screens/room/ImageControlScreen';
import SelfAssessmentResultScreen from '../screens/main/SelfAssessmentResultScreen';
import { RoomProvider } from '../contexts/RoomContext';
import { MemoryProvider } from '../contexts/MemoryContext';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <RoomProvider>
            <MemoryProvider>

                <Stack.Navigator screenOptions={{
                    contentStyle: { backgroundColor: WHITE },
                    headerLeft: HeaderLeft,
                    headerShadowVisible: false,
                    headerTitleAlign: 'center'
                }}>
                    {/*메인 화면 탭*/}
                    <Stack.Screen name={MainRoutes.CONTENT_TAB} component={MainTab}
                                  options={{ headerShown: false }} />

                    {/*추모관 탭*/}
                    <Stack.Screen name={MainRoutes.ROOM_TAB} component={RoomTab} />

                    {/*추모관 추가 화면*/}
                    <Stack.Screen name={MainRoutes.ROOM_REGISTER} component={RoomRegisterScreen} />

                    {/*추모관 수정 화면*/}
                    <Stack.Screen name={MainRoutes.ROOM_UPDATE} component={RoomUpdateScreen} />

                    {/*프로필 수정 화면*/}
                    <Stack.Screen name={MainRoutes.PROFILE_UPDATE} component={ProfileUpdateScreen} />

                    {/*자가진단 결과 화면*/}
                    <Stack.Screen name={MainRoutes.SELF_ASSESSMENT_RESULT} component={SelfAssessmentResultScreen}
                                  options={{ headerShown: false }} />


                    {/*이미지 조회 화면*/}
                    <Stack.Screen name={RoomRoutes.IMAGE_CONTROL} component={ImageControlScreen}
                                  options={{
                                      title: '', animation: 'slide_from_bottom'
                                  }} />

                    {/*추모관 내 갤러리 목록 스위퍼 화면*/}
                    <Stack.Screen name={RoomRoutes.GALLERY_SWIPER} component={GallerySwiperScreen}
                                  options={{ headerShown: false, animation: 'slide_from_bottom' }} />

                    {/*추모관 내 3D 조회 화면*/}
                    <Stack.Screen name={RoomRoutes.THREE_DIMENSION} component={ThreeDimensionScreen}
                                  options={{ headerShown: false }} />

                    {/*추모관 내 추억의 영상 추가 화면*/}
                    <Stack.Screen name={RoomRoutes.MEMORY_REGISTER} component={MemoryRegisterScreen}
                                  options={{ title: '추억의 영상 등록' }} />
                </Stack.Navigator>
            </MemoryProvider>
        </RoomProvider>
    );
};

export default MainStack;
