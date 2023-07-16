import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {AuthRoutes} from "./Routes";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import {WHITE} from "../Colors";
import IntroScreen from "../screens/auth/IntroScreen";
import * as SecureStore from "../utils/PreferenceStore";

const Stack = createNativeStackNavigator()

const AuthStack = ({checkIntro}) => {
    return (
        <Stack.Navigator
            screenOptions={{contentStyle: {backgroundColor: WHITE}, headerShown: false}}>

            {/*{checkIntro !== "1" && <Stack.Screen name={AuthRoutes.INTRO} component={IntroScreen}/>}*/}
            <Stack.Screen name={AuthRoutes.INTRO} component={IntroScreen}/>
            <Stack.Screen name={AuthRoutes.SIGN_IN} component={SignInScreen}/>
            <Stack.Screen name={AuthRoutes.SIGN_UP} component={SignUpScreen}/>



        </Stack.Navigator>
    );
};

export default AuthStack;
