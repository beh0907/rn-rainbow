import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import VerticalRoomItem from "./VerticalRoomItem";
import useRooms from "../../hooks/UseRooms";

const AllRoomList = () => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching
    } = useRooms()

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.container}
            data={rooms}
            renderItem={({item}) => <VerticalRoomItem room={item}/>}
            keyExtractor={(item, index) => index}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            onEndReached={fetchNextPage}
            refreshing={refetching}
            onRefresh={refetch}
        />
    )
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
    }
})

export default AllRoomList;
