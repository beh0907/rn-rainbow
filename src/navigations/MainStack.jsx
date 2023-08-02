import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainRoutes, RoomRoutes } from './Routes';
import { WHITE } from '../Colors';
import HeaderLeft from '../components/view/HeaderLeft';
import MainTab from '../screens/tab/MainTab';
import RoomTab from '../screens/tab/RoomTab';
import ProfileUpdateScreen from '../screens/main/ProfileUpdateScreen';
import GallerySwiperScreen from '../screens/room/GallerySwiperScreen';
import RoomRegisterScreen from '../screens/main/RoomRegisterScreen';
import { RoomProvider } from '../contexts/RoomContext';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <RoomProvider>
            <Stack.Navigator screenOptions={{
                contentStyle: { backgroundColor: WHITE },
                headerLeft: HeaderLeft,
                headerShadowVisible: false,
                headerTitleAlign: 'center'
            }}>
                <Stack.Screen name={MainRoutes.CONTENT_TAB} component={MainTab}
                              options={{ headerShown: false }} />

                <Stack.Screen name={MainRoutes.ROOM_TAB} component={RoomTab} />
                <Stack.Screen name={MainRoutes.ROOM_REGISTER} component={RoomRegisterScreen} />
                <Stack.Screen name={MainRoutes.PROFILE_UPDATE} component={ProfileUpdateScreen} />
                <Stack.Screen name={RoomRoutes.GALLERY_SWIPER} component={GallerySwiperScreen} />
            </Stack.Navigator>
        </RoomProvider>
    );
};

export default MainStack;
