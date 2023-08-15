import { StatusBar } from 'expo-status-bar';
import Navigation from './navigations/Navigation';
import { UserProvider } from './contexts/UserContext';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
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

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        //알림을 받았을 때 이벤트
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log('알림', notification);
        });

        //알림을 선택했을 때 이벤트
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('응답', response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

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

const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C'
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
        })).data;
        console.log('토큰', token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
};
