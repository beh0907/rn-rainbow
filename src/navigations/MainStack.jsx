import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MainRoutes} from "./Routes";
import {WHITE} from "../Colors";
import HeaderLeft from "../components/view/HeaderLeft";
import HomeScreen from "../screens/main/HomeScreen";
import MainTab from "./MainTab";
import RoomListScreen from "../screens/main/RoomListScreen";
import RoomScreen from "../screens/room/RoomScreen";

const Stack = createNativeStackNavigator()

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            contentStyle: {backgroundColor: WHITE},
            // title: '',
            headerLeft: HeaderLeft,
        }}>
            {/*<Stack.Screen name={MainRoutes.LIST_ROOM} component={HomeScreen}/>*/}
            <Stack.Screen name={MainRoutes.CONTENT_TAB} component={MainTab} options={{headerShown: false}}/>
            <Stack.Screen name={MainRoutes.ROOM_LIST} component={RoomListScreen} options={{headerShown: false}}/>
            <Stack.Screen name={MainRoutes.ROOM} component={RoomScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

export default MainStack;
