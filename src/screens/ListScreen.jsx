import React from 'react';
import {Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import SafeInputView from "../components/SafeInputView";

const ListScreen = props => {
    return (
        <SafeInputView>
            <StatusBar style={"light"}/>
            <View>
                <Text>리스트 화면</Text>
            </View>
        </SafeInputView>

    );
};

ListScreen.propTypes = {};

export default ListScreen;
