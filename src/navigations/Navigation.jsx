import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import AuthStack from "./AuthStack";
import {Asset} from "expo-asset";
import {useUserState} from "../contexts/UserContext";
import * as SecureStore from "../utils/PreferenceStore";
import {signIn} from "../api/Auth";
import MainStack from "./MainStack";

const ImageAssets = [
    require('../../assets/icon.png'),
    require('../../assets/cover.png')
]

const Navigation = () => {
    const [user, setUser] = useUserState()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync()

                // 백그라운드 이미지 캐싱
                await Promise.all(
                    ImageAssets.map(image => Asset.fromModule(image).downloadAsync())
                )

                //SecureStore에 저장된 로그인 정보를 가져온다
                const id = await SecureStore.getValueFor('id')
                const password = await SecureStore.getValueFor('password')

                if (id !== null && password !== null) {
                    const user = await signIn({id, password})
                    if (user) setUser(user)

                    setIsReady(true)
                } else {
                    setIsReady(true)
                }
            } catch (e) {
                setIsReady(true)
                console.log(e)
            }
        })()
    }, [setUser])

    const onReady = async () => {
        if (isReady) await SplashScreen.hideAsync()
    }

    if (!isReady) return null
    return (
        <NavigationContainer onReady={onReady}>
            {/*<AuthStack/>*/}
            {user.id ? <MainStack/> : <AuthStack/>}
        </NavigationContainer>
    );
};

export default Navigation;
