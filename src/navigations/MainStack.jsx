import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MainRoutes} from "./Routes";
import {WHITE} from "../Colors";
import HeaderLeft from "../components/view/HeaderLeft";
import MainTab from "../screens/tab/MainTab";
import ImagePickerScreen from "../screens/main/ImagePickerScreen";
import RoomTab from "../screens/tab/RoomTab";
import RoomRegisterScreen from "../screens/main/RoomRegisterScreen";
import ProfileUpdateScreen from "../screens/main/ProfileUpdateScreen";

const Stack = createNativeStackNavigator()

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            contentStyle: {backgroundColor: WHITE},
            headerLeft: HeaderLeft,
        }}>
            <Stack.Screen name={MainRoutes.CONTENT_TAB} component={MainTab}
                          options={{headerShown: false}}/>
            <Stack.Screen name={MainRoutes.ROOM_TAB} component={RoomTab}/>
            {/*<Stack.Screen name={MainRoutes.ROOM_REGISTER} component={RoomRegisterScreen}*/}
            {/*              options={{headerShown: false}}/>*/}
            <Stack.Screen name={MainRoutes.PROFILE_UPDATE} component={ProfileUpdateScreen}
                          options={{headerShown: false}}/>
            <Stack.Screen name={MainRoutes.IMAGE_PICKER} component={ImagePickerScreen}/>
        </Stack.Navigator>
    );
};

export default MainStack;
