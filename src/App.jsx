import { StatusBar } from 'expo-status-bar';
import Navigation from './navigations/Navigation';
import { UserProvider } from './contexts/UserContext';
import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { SnackBarProvider } from './contexts/SnackBarContext';
import CustomSnackBar from './components/message/CustomSnackBar';
import { PRIMARY } from './Colors';
import CustomDialog from './components/message/CustomDialog';
import { DialogProvider } from './contexts/DialogContext';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
});

const theme = {
    ...DefaultTheme,
    roundness: 4,
    colors: {
        ...DefaultTheme.colors,
        primary: PRIMARY.DEFAULT,
        accent: PRIMARY.DARK,
        text: PRIMARY.DEFAULT,
        disabled: PRIMARY.LIGHT
    }
};

export default function App() {
    const [notification, setNotification] = useState();
    const notificationListener = useRef();
    const responseListener = useRef();

    useLayoutEffect(() => {
        (async () => {
            if (Platform.OS === 'android') {
                const channel = await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: PRIMARY.LIGHT
                });
            }

            //알림을 받았을 때 이벤트
            notificationListener.current = Notifications.addNotificationReceivedListener(event => {
                setNotification(event);
                console.log('알림 받았어용', event);
            });

            //알림을 선택했을 때 이벤트
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                const data = response.notification.request.trigger.remoteMessage;
                console.log('푸시 아이디', data.data.id);
                console.log('푸시 타입', data.data.type);
            });
        })()

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <PaperProvider theme={theme}>
            <SnackBarProvider>
                <DialogProvider>
                    <UserProvider>
                        {/*다이얼로그*/}
                        <CustomDialog />
                        {/*하단 스낵바 알림 메시지*/}
                        <CustomSnackBar />

                        <StatusBar style='dark' />
                        <Navigation />
                    </UserProvider>
                </DialogProvider>
            </SnackBarProvider>
        </PaperProvider>
    );
}
