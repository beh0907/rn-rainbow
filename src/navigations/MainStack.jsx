import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MainRoutes} from "./Routes";
import {WHITE} from "../Colors";
import HeaderLeft from "../components/view/HeaderLeft";
import MainTab from "./MainTab";
import RoomListScreen from "../screens/main/RoomListScreen";
import RoomScreen from "../screens/room/RoomScreen";
import ImagePickerScreen from "../screens/main/ImagePickerScreen";

const Stack = createNativeStackNavigator()

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            contentStyle: {backgroundColor: WHITE},
            // title: '',
            headerLeft: HeaderLeft,
        }}>
            <Stack.Screen name={MainRoutes.CONTENT_TAB} component={MainTab} options={{headerShown: false}}/>
            {/*<Stack.Screen name={MainRoutes.CONTENT_TAB} component={MainTab} options={{headerShown: false}}/>*/}
            <Stack.Screen name={MainRoutes.ROOM_LIST} component={RoomListScreen} options={{headerShown: false}}/>
            <Stack.Screen name={MainRoutes.ROOM} component={RoomScreen} options={{headerShown: false}}/>
            <Stack.Screen name={MainRoutes.IMAGE_PICKER} component={ImagePickerScreen}/>
        </Stack.Navigator>
    );
};

export default MainStack;
