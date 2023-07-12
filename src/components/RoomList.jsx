import React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import RoomItem from "./RoomItem";
import UseRooms from "../hooks/UseRooms";

const RoomList = () => {
    const {posts, fetchNextPage, refetch, refetching} = UseRooms()

    return (
        <FlatList
            style={styles.container}
            data={posts}
            renderItem={({item}) => <RoomItem key={item.roomNum} room={item}/>}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            onEndReached={fetchNextPage}
            refreshing={refetching}
            onRefresh={refetch}
        />
    )
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        marginTop: 10
    },
    separator: {
        marginVertical: 10,
    }
})

export default RoomList;
