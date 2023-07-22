import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from "react-native";
import RoomItem from "./RoomItem";
import {useUserState} from "../../contexts/UserContext";
import {readMyRoomList} from "../../api/Room";

const MyRoomList = ({isHorizontal}) => {
    const [user,] = useUserState()
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        (async () => {
            setRooms(await readMyRoomList(user.id))
        })();
    }, [])

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={isHorizontal}
            style={styles.container}
            data={rooms}
            renderItem={({item}) => <RoomItem room={item}/>}
            keyExtractor={(item, index) => index}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            contentContainerStyle={{alignItems:"center"}}
        />
    )
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    separator: {
        marginHorizontal: 10,
    }
})

export default MyRoomList;
