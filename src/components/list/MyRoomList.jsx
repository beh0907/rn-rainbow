import React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import RoomItem from "./RoomItem";
import useMyRooms from "../../hooks/UseMyRooms";
import {useUserState} from "../../contexts/UserContext";

const MyRoomList = ({isHorizontal}) => {
    const [user,] = useUserState()
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching
    } = useMyRooms(user)

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
        marginTop: 10,
    },
    separator: {
        marginHorizontal: 10,
    }
})

export default MyRoomList;
