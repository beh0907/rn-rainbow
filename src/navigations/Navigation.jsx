import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import AuthStack from "./AuthStack";
import {Asset} from "expo-asset";
import {useUserState} from "../contexts/UserContext";
import * as SecureStore from "../utils/PreferenceStore";
import MainStack from "./MainStack";
import {signIn} from "../api/Auth";
import {STORE_SETTING_KEYS, STORE_USER_KEYS} from "../utils/PreferenceStore";

const ImageAssets = [
    require('../../assets/icon.png'),
    require('../../assets/cover.png'),
    require('../../assets/background/bg_intro_1.png'),
    require('../../assets/background/bg_intro_2.png'),
    require('../../assets/background/bg_intro_3.png'),
    require('../../assets/background/bg_intro_4.png'),
]

const Navigation = () => {
    const [user, setUser] = useUserState()
    const [isReady, setIsReady] = useState(false)

    const [checkIntro, setCheckIntro] = useState('')

    useEffect(() => {
        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync()

                // 백그라운드 이미지 캐싱
                await Promise.all(
                    ImageAssets.map(image => Asset.fromModule(image).downloadAsync())
                )

                const check = await SecureStore.getValueFor(STORE_SETTING_KEYS.CheckIntro)

                //인트로 체크 여부를 가져온다
                setCheckIntro(check)

                //SecureStore에 저장된 로그인 정보를 가져온다
                const id = await SecureStore.getValueFor(STORE_USER_KEYS.ID)
                const password = await SecureStore.getValueFor(STORE_USER_KEYS.PASSWORD)
                const provider = await SecureStore.getValueFor(STORE_USER_KEYS.PROVIDER)

                if (id !== null && password !== null) {
                    const user = await signIn({id, password})
                    if (user) setUser(user)
                }

                setIsReady(true)
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
            {user.id ? <MainStack/> : <AuthStack checkIntro={checkIntro}/>}
        </NavigationContainer>
    );
}

export default Navigation
