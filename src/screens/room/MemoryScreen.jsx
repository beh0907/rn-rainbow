import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {readMemoryList} from "../../api/Memory";

const RoomScreen = ({route}) => {
    const {roomNum} = route.params;

    const [memories,setMemories] = useState([])

    useEffect(() => {
        (async () => {
            setMemories(await readMemoryList(roomNum, 2)) // 1은 이미지 2는 비디오 메모리
            console.log("메모리", memories)
        })();
    }, [])

    return (
        <View style={[styles.container]}>
            <Text>메모리</Text>
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
