import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { readGalleryList } from '../../api/Gallery';
import { useNavigation } from '@react-navigation/native';
import { RoomRoutes } from '../../navigations/Routes';
import GalleryItem from '../../components/item/GalleryItem';
import MasonryList from '@react-native-seoul/masonry-list';
import { useRoomState } from '../../contexts/RoomContext';

const GalleryScreen = () => {
    const [room, ] = useRoomState();
    const [galleries, setGalleries] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            setGalleries(await readGalleryList(room.roomNum));
            console.log("갤러리", galleries)
        })();
    }, []);

    const onPress = (index) => {
        navigation.navigate(RoomRoutes.GALLERY_SWIPER, {
            galleries,
            position: index
        });
    };

    return (
        <View style={styles.container}>
            <MasonryList
                style={{ height: '100%', width: '100%', alignSelf: 'stretch' }}
                contentContainerStyle={{
                    padding: 5,
                    alignSelf: 'stretch'
                }}
                data={galleries}
                keyExtractor={(item) => item.seq}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, i }) => <GalleryItem item={item} onPress={() => onPress(i)} />}
                // refreshing={isLoadingNext}
                // onRefresh={() => refetch({first: ITEM_CNT})}
                // onEndReachedThreshold={0.1}
                // onEndReached={() => loadNext(ITEM_CNT)}
            />
        </View>
    );
};

GalleryScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    }
});

export default GalleryScreen;
