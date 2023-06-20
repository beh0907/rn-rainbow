import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MainRoutes} from "./Routes";
import {WHITE} from "../Colors";
import HeaderLeft from "../components/HeaderLeft";

const Stack = createNativeStackNavigator()

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            contentStyle: {backgroundColor: WHITE},
            title: '',
            headerLeft: HeaderLeft,
        }}>
            {/*<Stack.Screen name={MainRoutes.CONTENT_TAB} component={ContentTab} options={{headerShown: false}}/>*/}
        </Stack.Navigator>
    );
};

export default MainStack;
