import React, { useCallback, useRef, useState } from 'react';
import { useUserState } from '../../contexts/UserContext';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, StyleSheet, View } from 'react-native';
import { WHITE } from '../../Colors';
import Constants from 'expo-constants';

const { BASE_URL_BOARD } = Constants.expoConfig.extra;

const BoardScreen = props => {
    const [user] = useUserState();
    const { top, bottom } = useSafeAreaInsets();

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
        }, [canGoBack])
    );

    const onShouldStartLoadWithRequest = event => {
        if (event.url.endsWith('#')) {
            setCanGoBack(false);
            return false; // Block the URL with '#' from loading
        }
        return true; // Allow other URLs to load
    };

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <WebView
                ref={webViewRef}
                source={{ uri: `${BASE_URL_BOARD}?user_id=${user.id}` }}
                javaScriptEnabled={true}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                }}
            />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE
    }
});

export default BoardScreen;
