import {StatusBar} from 'expo-status-bar';
import Navigation from "./navigations/Navigation";
import {UserProvider} from "./contexts/UserContext";
import * as React from "react";
import {PaperProvider} from "react-native-paper";
import {MessageProvider} from "./contexts/MessageContext";
import SnackBar from "./components/SnackBar";

export default function App() {
    return (
        <PaperProvider>
            <MessageProvider>
                <UserProvider>
                    {/*하단 스낵바 알림 메시지*/}
                    <SnackBar/>

                    <StatusBar style="dark"/>
                    <Navigation/>
                </UserProvider>
            </MessageProvider>
        </PaperProvider>
    );
}
