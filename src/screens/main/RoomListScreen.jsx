import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const RoomListScreen = props => {
    const {top, bottom} = useSafeAreaInsets();

    return (
        <View style={[styles.container, {marginTop: top}]}>
            <Text>추모관 목록 상세 조회</Text>
        </View>
    );
};

RoomListScreen.propTypes = {

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default RoomListScreen;
