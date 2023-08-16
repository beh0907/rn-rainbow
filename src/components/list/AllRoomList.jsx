import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import VerticalCardRoomItem from '../item/VerticalCardRoomItem';
import useRooms from '../../hooks/UseRooms';
import PropTypes from 'prop-types';
import VerticalListRoomItem from '../item/VerticalListRoomItem';
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

const AllRoomList = ({ value }) => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching,
        isLoading
    } = useRooms();

    const renderItem = useCallback(({ item }) => {
        return value === 'card' ? <VerticalCardRoomItem room={item} /> : <VerticalListRoomItem room={item} />;
    }, [value]);

    const ItemSeparatorComponent = useCallback(() => {
        return <View style={styles.separator} />;
    }, []);

    const keyExtractor = useCallback((item, index) => index.toString(),[])

    // FlatList를 감싸는 새로운 컴포넌트를 만듭니다.
    return (
        <FlashList
            estimatedItemSize={ value === 'card' ? 205 : 124} // 카드뷰라면 205, 리스트라면 124로 예상사이즈 설정
            key={value}
            showsVerticalScrollIndicator={false}
            data={rooms}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
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
        // paddingTop:10
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
