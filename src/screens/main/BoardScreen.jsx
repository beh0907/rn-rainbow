import React, {useCallback, useRef, useState} from 'react';
import {BASE_URL_BOARD} from "@env";
import {useUserState} from "../../contexts/UserContext";
import {WebView} from "react-native-webview";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useFocusEffect} from "@react-navigation/native";
import {BackHandler} from "react-native";

const BoardScreen = props => {
    const [user,] = useUserState();
    const {top, bottom} = useSafeAreaInsets();

    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (webViewRef.current && canGoBack) {
                    webViewRef.current.goBack();
                    return true;
                } else {
                    return false;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [canGoBack]),
    );

    const onShouldStartLoadWithRequest = event => {
        if (event.url.endsWith('#')) {
            setCanGoBack(false);
            return false; // Block the URL with '#' from loading
        }
        return true; // Allow other URLs to load
    }

    return (
        <WebView
            ref={webViewRef}
            source={{uri: `${BASE_URL_BOARD}?user_id=${user.id}`}}
            style={{marginTop: top}}
            javaScriptEnabled={true}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            onNavigationStateChange={(navState) => {
                setCanGoBack(navState.canGoBack)
            }}
        />
    );
};

export default BoardScreen;
