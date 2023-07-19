import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import RoomItem from "./RoomItem";
import useRooms from "../../hooks/UseRooms";
import useMyRooms from "../../hooks/UseMyRooms";
import useFavoriteRooms from "../../hooks/UseFavoriteRooms";
import {useUserState} from "../../contexts/UserContext";

const FavoriteRoomList = ({isHorizontal}) => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching
    } = useFavoriteRooms()

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={isHorizontal}
            style={styles.container}
            data={rooms}
            renderItem={({item}) => <RoomItem room={item}/>}
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
        marginTop: 10,
    },
    separator: {
        marginHorizontal: 10,
    }
})

export default FavoriteRoomList;
