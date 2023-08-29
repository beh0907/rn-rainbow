import { StatusBar } from 'expo-status-bar';
import Navigation from './navigations/Navigation';
import { UserProvider } from './contexts/UserContext';
import * as React from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { SnackBarProvider } from './contexts/SnackBarContext';
import CustomSnackBar from './components/message/CustomSnackBar';
import { PRIMARY } from './Colors';
import CustomDialog from './components/message/CustomDialog';
import { DialogProvider } from './contexts/DialogContext';

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
