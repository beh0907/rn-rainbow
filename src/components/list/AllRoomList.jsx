import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import VerticalCardRoomItem from '../item/VerticalCardRoomItem';
import useRooms from '../../hooks/UseRooms';
import PropTypes from 'prop-types';
import VerticalListRoomItem from '../item/VerticalListRoomItem';

const AllRoomList = ({ value }) => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching
    } = useRooms();

    // FlatList를 감싸는 새로운 컴포넌트를 만듭니다.
    return (
        <FlatList
            key={value}
            numColumns={value === 'grid' ? 2 : 1}
            showsVerticalScrollIndicator={false}
            style={styles.container}
            data={rooms}
            renderItem={({ item }) => {
                return  value === 'card' ? <VerticalCardRoomItem room={item} /> : <VerticalListRoomItem room={item} />
            }}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            onEndReached={fetchNextPage}
            refreshing={refetching}
            onRefresh={refetch}
        />
    );
};

AllRoomList.propTypes = {
    value: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: '100%'
    },
    separator: {
        // marginVertical: 10,
    }
});

export default AllRoomList;
