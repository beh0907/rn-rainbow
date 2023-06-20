import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {AuthRoutes} from "./Routes";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import {WHITE} from "../Colors";

const Stack = createNativeStackNavigator()

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{contentStyle: {backgroundColor: WHITE}, headerShown: false}}>
            <Stack.Screen name={AuthRoutes.SIGN_IN} component={SignInScreen}/>
            <Stack.Screen name={AuthRoutes.SIGN_UP} component={SignUpScreen}/>
        </Stack.Navigator>
    );
};

export default AuthStack;
