import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import VerticalCardRoomItem from '../item/VerticalCardRoomItem';
import useRooms from '../../hooks/UseRooms';
import PropTypes from 'prop-types';
import VerticalListRoomItem from '../item/VerticalListRoomItem';
import { Text } from 'react-native-paper';

const AllRoomList = ({ value }) => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching,
        isLoading
    } = useRooms();

    // FlatList를 감싸는 새로운 컴포넌트를 만듭니다.
    return (
        <FlatList
            key={value}
            showsVerticalScrollIndicator={false}
            style={styles.container}
            data={rooms}
            renderItem={({ item }) => {
                return value === 'card' ? <VerticalCardRoomItem room={item} /> : <VerticalListRoomItem room={item} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            onEndReached={fetchNextPage}
            refreshing={refetching}
            onRefresh={refetch}
            ListFooterComponent={isLoading && <Text>목록을 불러오고 있습니다.</Text>}
            ListFooterComponentStyle={styles.listFooter}
        />
    );
};

AllRoomList.defaultProps = {
    value: 'list'
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
    },
    listFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AllRoomList;
