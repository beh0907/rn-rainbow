import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { readGalleryList } from '../../api/Gallery';
import { useNavigation } from '@react-navigation/native';
import { RoomRoutes } from '../../navigations/Routes';
import GalleryItem from '../../components/item/GalleryItem';
import MasonryList from '@react-native-seoul/masonry-list';
import { useRoomState } from '../../contexts/RoomContext';
import { Button } from 'react-native-paper';
import { useUserState } from '../../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';

const GalleryScreen = () => {
    const [user] = useUserState();
    const [room] = useRoomState();
    const [galleries, setGalleries] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            setGalleries(await readGalleryList(room.roomNum));
        })();
    }, []);

    const onPressImage = (index) => {
        navigation.navigate(RoomRoutes.GALLERY_SWIPER, {
            galleries,
            position: index
        });
    };

    const pickImage = useCallback(async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection:true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });

        // if (result.assets) {
        //     setImage(result.assets[0].uri);
        // }
    }, []);

    const deleteImage = useCallback(async () => {
    }, []);

    return (
        <View style={styles.container}>
            {galleries.length === 0 ?
                <Text>등록된 이미지가 없습니다</Text>
                :
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
                    renderItem={({ item, i }) => <GalleryItem item={item} onPress={() => onPressImage(i)} />}
                    ListHeaderComponent={
                        //추모관 개설자는 갤러리를 추가하거나 삭제할 수 있다
                        user.id === room.id &&
                        <View style={styles.listHeader}>
                            <Button icon='camera' mode='contained' onPress={pickImage}>추가</Button>
                            <Button icon='delete' mode='contained' onPress={deleteImage}>삭제</Button>
                        </View>
                    }
                    // refreshing={isLoadingNext}
                    // onRefresh={() => refetch({first: ITEM_CNT})}
                    // onEndReachedThreshold={0.1}
                    // onEndReached={() => loadNext(ITEM_CNT)}
                />
            }
        </View>
    );
};

GalleryScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    listHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});

export default GalleryScreen;
