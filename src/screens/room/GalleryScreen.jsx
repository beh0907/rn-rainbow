import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import {readGalleryList} from "../../api/Gallery";
import {useNavigation} from "@react-navigation/native";
import {RoomRoutes} from "../../navigations/Routes";
import GalleryItem from "../../components/list/GalleryItem";
import MasonryList from '@react-native-seoul/masonry-list';

const GalleryScreen = ({route}) => {
    const {roomNum} = route.params;
    const [galleries, setGalleries] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
        (async () => {
            setGalleries(await readGalleryList(roomNum))
        })();
    }, [])

    const onPress = (index) => {
        navigation.navigate(RoomRoutes.GALLERY_SWIPER, {
            galleries,
            position: index
        })
    }

    return (
        <View style={styles.container}>
            <MasonryList
                style={{height: "100%", width: "100%"}}
                data={galleries}
                keyExtractor={(item) => item.seq}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => <GalleryItem item={item} index={index} onPress={() => onPress(index)}/>}
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
        height:"100%"
    }
})

export default GalleryScreen;
