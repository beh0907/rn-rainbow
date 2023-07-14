import React from 'react';
import {BASE_URL_BOARD} from "@env"
import {useUserState} from "../../contexts/UserContext";
import WebView from "react-native-webview";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const BoardScreen = props => {
    const [user,] = useUserState()
    const {top, bottom} = useSafeAreaInsets()

    return (
        <WebView
            source={{ uri: `${BASE_URL_BOARD}?user_id=${user.id}` }}
            style={{ marginTop: top }}
        />
    );
};

BoardScreen.propTypes = {

};

export default BoardScreen;
