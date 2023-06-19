import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import AuthStack from "./AuthStack";
import {Asset} from "expo-asset";
import {useUserState} from "../contexts/UserContext";
import * as SecureStore from "../utils/SecureStore";

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

                console.log(id)
                console.log(password)

                if (id !== null && password !== null) {
                    //로그인 시도
                    axios.get('/user?ID=12345')
                        .then(function (response) {
                            console.log(response);
                            setIsReady(true)
                        })
                        .catch(function (error) {
                            console.log(error);
                            setIsReady(true)
                        });
                } else {
                    setIsReady(true)
                }


                //로그인 시도
                // const unsubscribe = onAuthStateChanged(user => {
                //     if (user) setUser(user)
                //
                //     setIsReady(true)
                //     unsubscribe()
                // })
            } catch (e) {
                console.log(e)
                setIsReady(true)
            }
        })()
    }, [setUser])

    const onReady = async () => {
        if (isReady) await SplashScreen.hideAsync()
    }

    if (!isReady) return null
    return (
        <NavigationContainer onReady={onReady}>
            <AuthStack/>
            {/*{user.uid ? <MainStack/> : <AuthStack/>}*/}
        </NavigationContainer>
    );
};

export default Navigation;
