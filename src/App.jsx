import { StatusBar } from 'expo-status-bar';
import Navigation from './navigations/Navigation';
import { UserProvider } from './contexts/UserContext';
import * as React from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { MessageProvider } from './contexts/MessageContext';
import SnackBar from './components/message/SnackBar';
import { PRIMARY } from './Colors';
import { RoomProvider } from './contexts/RoomContext';

export default function App() {
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
            <MessageProvider>
                <UserProvider>
                        {/*하단 스낵바 알림 메시지*/}
                        <SnackBar />

                        <StatusBar style='dark' />
                        <Navigation />
                </UserProvider>
            </MessageProvider>
        </PaperProvider>
    );
}
