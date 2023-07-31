import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import VerticalCardRoomItem from '../item/VerticalCardRoomItem';
import useRooms from '../../hooks/UseRooms';
import PropTypes from 'prop-types';
import VerticalListRoomItem from '../item/VerticalListRoomItem';
import VerticalGridCardRoomItem from '../item/VerticalGridCardRoomItem';

const AllRoomList = ({ value }) => {
    const [renderItemType, setRenderItemType] = useState('card'); // 초기값으로 card 설정

    useEffect(() => {
        // value 값에 따라 renderItem 유형 변경
        switch (value) {
            case 'list':
                setRenderItemType('list');
                break;
            case 'grid':
                setRenderItemType('grid');
                break;
            default:
                setRenderItemType('card');
                break;
        }
    }, [value]);

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
                switch (renderItemType) {
                    case 'list':
                        return <VerticalListRoomItem room={item} />;
                    case 'grid':
                        return <VerticalGridCardRoomItem room={item} />;
                    default: // card
                        return <VerticalCardRoomItem room={item} />;
                }
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
        paddingTop: 10,
        width: '100%'
    },
    separator: {
        marginVertical: 10,
    }
});

export default AllRoomList;
