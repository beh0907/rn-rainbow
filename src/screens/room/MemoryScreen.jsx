import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import {readRoom} from "../../api/Room";
import {readCommentList} from "../../api/Comment";
import {readMemoryList} from "../../api/Memory";
import {readGalleryList} from "../../api/Gallery";

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
