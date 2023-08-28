import React, { useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import AuthStack from './AuthStack';
import { Asset } from 'expo-asset';
import { useUserState } from '../contexts/UserContext';
import * as SecureStore from '../utils/PreferenceStore';
import { STORE_SETTING_KEYS, STORE_USER_KEYS } from '../utils/PreferenceStore';
import MainStack from './MainStack';
import * as Auth from '../api/Auth';
import { signIn } from '../api/Auth';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { useDialogState } from '../contexts/DialogContext';
import * as KakaoLogins from '@react-native-seoul/kakao-login';
import Constants from 'expo-constants';

const ImageAssets = [
    require('../../assets/icon.png'),
    require('../../assets/background/bg_intro_1.png'),
    require('../../assets/background/bg_intro_2.png'),
    require('../../assets/background/bg_intro_3.png'),
    require('../../assets/background/bg_intro_4.png'),
    require('../../assets/logo.png'),
    require('../../assets/background/bg_temp.jpg')
];

const Navigation = () => {
    const [user, setUser] = useUserState();

    //필요 데이터 로드 완료 여부 스플래시 화면을 종료시킨다
    const [isReady, setIsReady] = useState(false);

    //인트로 상태 여부를 체크합니다
    const [checkIntro, setCheckIntro] = useState('');

    //권한
    const [mediaStatus, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
    const [cameraStatus, requestCameraPermission] = Camera.useCameraPermissions();

    //다이얼로그 설정
    const [, setDialog] = useDialogState();

    useLayoutEffect(() => {
        (async () => {
            try {
                //스플래시 화면을 표시한다
                await SplashScreen.preventAutoHideAsync();

                //미디어 및 카메라 접근 권한을 요청한다
                await requestMediaPermission();
                await requestCameraPermission();
                await Notifications.requestPermissionsAsync();
                // const {granted} = await requestMediaPermission()
                // const {granted} = await requestCameraPermission()

                // 백그라운드 이미지 캐싱
                await Promise.all(
                    ImageAssets.map(image => Asset.fromModule(image).downloadAsync())
                );

                //인트로 체크 여부를 가져와 설정한다
                setCheckIntro(await SecureStore.getValueFor(STORE_SETTING_KEYS.CHECK_INTRO));

                //SecureStore에 저장된 로그인 정보를 가져온다
                const id = await SecureStore.getValueFor(STORE_USER_KEYS.ID);
                const password = await SecureStore.getValueFor(STORE_USER_KEYS.PASSWORD);
                const provider = await SecureStore.getValueFor(STORE_USER_KEYS.PROVIDER);

                //저장된 정보에 따라 로그인을 시도한다
                let user;
                const fcmToken = (await Notifications.getDevicePushTokenAsync({
                    projectId: Constants.expoConfig.extra.eas.projectId
                })).data;

                switch (provider) {
                    case 'NATIVE':
                        user = await signIn({ id, password }, fcmToken);
                        break;
                    case 'KAKAO':
                        const token = await KakaoLogins.login();
                        const profile = await KakaoLogins.getProfile();

                        user = await Auth.signInKaKao(profile, fcmToken);
                        break;
                    default: //아무것도 없을 경우 무시한다
                        break;
                }

                //네이티브 혹은 카카오 로그인이 정상적으로 됐다면
                //유저 정보를 저장한다
                if (user) setUser(user);

                //로딩 화면을 완료한다
                setIsReady(true);

            } catch (error) {
                const code = error.code;
                const status = error.response?.status;

                let title = (code === 'ECONNABORTED' || status === 408) ? '통신 에러' : '로그인 실패';

                setDialog({
                    title: title,
                    message: '서버와의 통신에 실패하였습니다.',
                    onPress: async () => {
                        setIsReady(true);
                    },
                    visible: true,
                    isConfirm: false
                });
            }
        })();
    }, [setUser, setIsReady, setCheckIntro, requestMediaPermission, requestCameraPermission]);

    const onReady = async () => {
        if (isReady) await SplashScreen.hideAsync();
    };

    if (!isReady) return null;
    return (
        <NavigationContainer onReady={onReady}>
            {user.id ? <MainStack /> : <AuthStack checkIntro={checkIntro} />}
        </NavigationContainer>
    );
};

export default Navigation;
