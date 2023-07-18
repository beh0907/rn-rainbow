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
import * as MediaLibrary from 'expo-media-library'
import {Alert} from "react-native";

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

    //필요 데이터 로드 완료 여부 스플래시 화면을 종료시킨다
    const [isReady, setIsReady] = useState(false)

    //인트로 상태 여부를 체크합니다
    const [checkIntro, setCheckIntro] = useState('')

    //미디어 권한
    const [status, requestPermission] = MediaLibrary.usePermissions()

    useEffect(() => {
        (async () => {
            try {
                //스플래시 화면을 표시한다
                await SplashScreen.preventAutoHideAsync()

                //미디어 접근 권한을 요청한다
                const {granted} = await requestPermission()
                if (!granted) {
                    Alert.alert('미디어 접근 권한', '미디어 접근 권한이 필요합니다.', [
                        {
                            text: '확인',
                            onPress: () => {
                                // navigation.canGoBack() && navigation.goBack()
                            }
                        }
                    ])
                }

                // 백그라운드 이미지 캐싱
                await Promise.all(
                    ImageAssets.map(image => Asset.fromModule(image).downloadAsync())
                )

                //인트로 체크 여부를 가져와 설정한다
                const check = await SecureStore.getValueFor(STORE_SETTING_KEYS.CheckIntro)
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
    }, [setUser, setIsReady, setCheckIntro, requestPermission])

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
