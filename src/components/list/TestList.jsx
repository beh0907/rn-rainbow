import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import RoomItem from "./RoomItem";
import useRooms from "../../hooks/UseRooms";
import useMyRooms from "../../hooks/UseMyRooms";
import useFavoriteRooms from "../../hooks/UseFavoriteRooms";

const TestList = ({value}) => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching
    } = useRooms()

    return (
        <FlatList
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
        height: '100%',
        marginTop: 10,
    },
    separator: {
        marginVertical: 10,
    }
})

export default TestList;
