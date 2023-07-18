import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import RoomItem from "./RoomItem";
import useRooms from "../../hooks/UseRooms";
import useMyRooms from "../../hooks/UseMyRooms";
import useFavoriteRooms from "../../hooks/UseFavoriteRooms";
import {useUserState} from "../../contexts/UserContext";
import {PRIMARY} from "../../Colors";

const RoomList = ({isHorizontal}) => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching
    } = useRooms()

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={isHorizontal}
            style={styles.container}
            data={rooms}
            renderItem={({item}) => <RoomItem room={item}/>}
            keyExtractor={(item) => item.roomNum}
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
    },
    separator: {
        marginHorizontal: 10,
    }
})

export default RoomList;
