import React, { useLayoutEffect, useRef, useState } from 'react';
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
import { useDialogState } from '../contexts/DialogContext';
import * as KakaoLogins from '@react-native-seoul/kakao-login';
import Constants from 'expo-constants';
import { MainRoutes } from './Routes';
import * as Notifications from 'expo-notifications';
import { DIALOG_MODE } from '../components/message/CustomDialog';

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
    const navigationRef = useRef(null);
    const [user, setUser] = useUserState();

    //필요 데이터 로드 완료 여부 스플래시 화면을 종료시킨다
    const [isReady, setIsReady] = useState(false);

    //인트로 상태 여부를 체크합니다
    const [checkIntro, setCheckIntro] = useState('');

    //권한
    const [, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
    const [, requestCameraPermission] = Camera.useCameraPermissions();

    //다이얼로그 설정
    const [, setDialog] = useDialogState();

    //푸시 메시지 관련 변수
    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState();
    // const notificationListener = useRef();
    // const responseListener = useRef();

    //백그라운드 fcm 메시지 수신 관련 소스
    // const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
    //
    // TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
    //     console.log('111');
    //     if (error) {
    //         console.log('Error occurred:', error);
    //     }
    //
    //     if (data) {
    //         // 수신한 데이터를 처리하고 원하는 화면으로 navigate 시킵니다.
    //         const roomId = data.data.id;
    //         navigationRef.current?.navigate(MainRoutes.ROOM_TAB, { roomNum: roomId });
    //     }
    // });

    //포그라운드 fcm 메시지 수신 관련 소스
    // useEffect(() => {
    //     (async () => {
    //         if (Platform.OS === 'android') {
    //             await Notifications.setNotificationChannelAsync('default', {
    //                 name: 'default',
    //                 importance: Notifications.AndroidImportance.MAX,
    //                 vibrationPattern: [0, 250, 250, 250],
    //                 lightColor: '#FF231F7C'
    //             });
    //         }
    //
    //         //알림이 표시될 때 이벤트
    //         notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //             console.log('notification', notification.remoteMessage);
    //         });
    //
    //         //알림이 터치할 때 이벤트
    //         responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //             const data = response.notification.request.trigger.remoteMessage;
    //             console.log('푸시 아이디', data.data.id);
    //             console.log('푸시 타입', data.data.type);
    //
    //             // 비로그인 상태에서는 FCM 토큰이 저장되어 있지 않아 알림X
    //             // 로그인 상태일 경우 MainStack의 화면만 사용하기 때문에 추가 조건문 필요X
    //             navigationRef.current?.navigate(MainRoutes.ROOM_TAB, {
    //                 roomNum: data.data.id
    //             });
    //         });
    //     })();
    //
    //     return () => {
    //         Notifications.removeNotificationSubscription(notificationListener.current);
    //         Notifications.removeNotificationSubscription(responseListener.current);
    //     };
    // }, []);

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

                const expoToken = (await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig.extra.eas.projectId
                })).data;

                switch (provider) {
                    case 'NATIVE':
                        // user = await signIn({ id, password }, fcmToken);
                        user = await signIn({ id, password }, expoToken);
                        break;
                    case 'KAKAO':
                        const token = await KakaoLogins.login();
                        const profile = await KakaoLogins.getProfile();

                        // user = await Auth.signInKaKao(profile, fcmToken);
                        user = await Auth.signInKaKao(profile, expoToken);
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
                    mode: DIALOG_MODE.ALERT
                });
            }
        })();
    }, [setUser, setIsReady, setCheckIntro, requestMediaPermission, requestCameraPermission]);

    const onReady = async () => {
        if (isReady) await SplashScreen.hideAsync();
    };

    if (!isReady) return null;
    return (
        <NavigationContainer onReady={onReady} ref={navigationRef}
                             linking={{
                                 config: {
                                     // Configuration for linking
                                 },
                                 subscribe() {
                                     //포그라운드에서 메시지 표시 핸들러
                                     Notifications.setNotificationHandler({
                                         handleNotification: async () => ({
                                             shouldShowAlert: true,
                                             shouldPlaySound: true,
                                             shouldSetBadge: true
                                         })
                                     });

                                     // 알림 메시지 터치 이벤트
                                     const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                                         console.log('response 22 : ', response.notification.request.trigger.remoteMessage.data);
                                         const expoPushData = response.notification.request.content.data;
                                         const fcmPushData = response.notification.request.trigger.remoteMessage.data;
                                         const { id, type } = expoPushData ?? fcmPushData;
                                         console.log('푸시 아이디', id);
                                         console.log('푸시 타입', type);

                                         // 비로그인 상태에서는 FCM 토큰이 저장되어 있지 않아 알림X
                                         // 로그인 상태일 경우 MainStack의 화면만 사용하기 때문에 추가 조건문 필요X
                                         navigationRef.current?.navigate(MainRoutes.ROOM_TAB, {
                                             roomNum: id,
                                             type: type
                                         });
                                     });

                                     return () => {
                                         subscription.remove();
                                     };
                                 }
                             }}
        >
            {user.id ? <MainStack /> : <AuthStack checkIntro={checkIntro} />}
        </NavigationContainer>
    );
};

export default Navigation;
