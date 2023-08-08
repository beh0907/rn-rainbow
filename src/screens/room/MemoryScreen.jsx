import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {readMemoryList} from "../../api/Memory";
import { useRoomState } from '../../contexts/RoomContext';
import MasonryList from '@react-native-seoul/masonry-list';
import GalleryItem from '../../components/item/GalleryItem';

const RoomScreen = () => {
    const [room, ] = useRoomState();
    const [memories,setMemories] = useState([])

    useEffect(() => {
        (async () => {
            setMemories(await readMemoryList(room.roomNum, 2)) // 1은 이미지 2는 비디오 메모리
            console.log("메모리", memories)
        })();
    }, [])

    return (
        <View style={[styles.container]}>

            {memories.length === 0 ?
                <Text>등록된 추억이 없습니다</Text>
                :
                <Text>등록된 추억이 없습니다</Text>
            }

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
