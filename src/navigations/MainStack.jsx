import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainRoutes, RoomRoutes } from './Routes';
import { WHITE } from '../Colors';
import HeaderLeft from '../components/view/HeaderLeft';
import MainTab from '../screens/tab/MainTab';
import RoomTab from '../screens/tab/RoomTab';
import GallerySwiperScreen from '../screens/room/GallerySwiperScreen';
import RoomRegisterScreen from '../screens/main/RoomRegisterScreen';
import { RoomProvider } from '../contexts/RoomContext';
import RoomUpdateScreen from '../screens/main/RoomUpdateScreen';
import MemoryRegisterScreen from '../screens/room/MemoryRegisterScreen';
import RoomTab2 from '../screens/tab/RoomTab2';

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

                {/*<Stack.Screen name={MainRoutes.ROOM_TAB} component={RoomTab} />*/}
                <Stack.Screen name={MainRoutes.ROOM_TAB} component={RoomTab2} />
                <Stack.Screen name={MainRoutes.ROOM_REGISTER} component={RoomRegisterScreen} />
                <Stack.Screen name={MainRoutes.ROOM_UPDATE} component={RoomUpdateScreen} />
                <Stack.Screen name={RoomRoutes.GALLERY_SWIPER} component={GallerySwiperScreen}
                              options={{ headerShown: false }} />
                <Stack.Screen name={RoomRoutes.MEMORY_REGISTER} component={MemoryRegisterScreen}
                              options={{ title: '' }} />
            </Stack.Navigator>
        </RoomProvider>
    );
};

export default MainStack;
