import { StatusBar } from 'expo-status-bar';
import Navigation from './navigations/Navigation';
import { UserProvider } from './contexts/UserContext';
import * as React from 'react';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { SnackBarProvider } from './contexts/SnackBarContext';
import CustomSnackBar from './components/message/CustomSnackBar';
import CustomDialog from './components/message/CustomDialog';
import { DialogProvider } from './contexts/DialogContext';

const theme = {
    ...DefaultTheme,
    roundness: 4
};

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <StatusBar style='dark' />

            <SnackBarProvider>
                <DialogProvider>
                    <UserProvider>

                        {/*다이얼로그*/}
                        <CustomDialog />
                        {/*하단 스낵바 알림 메시지*/}
                        <CustomSnackBar />

                        <Navigation />
                    </UserProvider>
                </DialogProvider>
            </SnackBarProvider>
        </PaperProvider>
    );
}
