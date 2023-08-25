import React from 'react';
import { StyleSheet, View } from 'react-native';
import useRooms from '../../hooks/UseRooms';
import ListRoomItem from '../item/ListRoomItem';
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

const AllRoomList = () => {
    const {
        rooms,
        fetchNextPage,
        refetch,
        refetching,
        isLoading
    } = useRooms();

    // FlatList를 감싸는 새로운 컴포넌트를 만듭니다.
    return (
        <FlashList
            estimatedItemSize={124} // 카드뷰라면 205, 리스트라면 124로 예상사이즈 설정
            showsVerticalScrollIndicator={false}
            data={rooms}
            renderItem={({ item }) => <ListRoomItem room={item} />}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={fetchNextPage}
            refreshing={refetching}
            onRefresh={refetch}
            ListFooterComponent={isLoading && <Text>목록을 불러오고 있습니다.</Text>}
            ListFooterComponentStyle={styles.listFooter}
        />
    );
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
