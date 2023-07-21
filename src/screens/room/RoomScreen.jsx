import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {readRoom} from "../../api/Room";

const RoomScreen = ({route}) => {
    const {roomNum} = route.params;

    const [room,setRoom] = useState({})
    // const [diaries,setDiaries] = useState({})

    useEffect(() => {
        (async () => {
            setRoom(await readRoom(roomNum))
            console.log("룸", room)
        })();
    }, [])

    return (
        <View style={[styles.container]}>
            <Text>추모관 메인 화면</Text>
        </View>
    );
};

RoomScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default RoomScreen;
