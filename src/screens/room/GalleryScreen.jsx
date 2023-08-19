import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RoomRoutes } from '../../navigations/Routes';
import GalleryItem from '../../components/item/GalleryItem';
import MasonryList from '@react-native-seoul/masonry-list';
import { useRoomState } from '../../contexts/RoomContext';
import { useUserState } from '../../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import * as Gallery from '../../api/Gallery';
import { Button } from 'react-native-paper';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { PRIMARY, WHITE } from '../../Colors';

const GalleryScreen = () => {
    const MAX_SELECT = 20;

    const [user] = useUserState();
    const [room] = useRoomState();

    const [, setSnackbar] = useSnackBarState();

    const [galleries, setGalleries] = useState([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectGalleries, setSelectGalleries] = useState([]);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        (async () => {
            await readGalleryList();
        })();
    }, []);

    const readGalleryList = useCallback(async () => {
        setIsLoading(true);

        const list = await Gallery.readGalleryList(room.roomNum);

        navigation.setOptions({
            tabBarLabel: `갤러리 ${list.length}`
        });

        setGalleries(list);

        setIsLoading(false);
    }, [navigation, isLoading, galleries]);

    const isSelectedGallery = (gallery) => {
        return selectGalleries.findIndex((item) => item.seq === gallery.seq) > -1;
    };

    const onPressImage = useCallback((index) => {
        navigation.navigate(RoomRoutes.GALLERY_SWIPER, {
            galleries,
            position: index
        });
    }, [galleries]);

    const onToggleImage = useCallback((gallery) => {
        console.log('gallery', gallery);
        console.log('isDeleteMode', isDeleteMode);
        // const gallery = galleries[index];
        const isSelected = isSelectedGallery(gallery);
        setSelectGalleries((prev) => {
            if (isSelected) {
                return prev.filter((item) => item.seq !== gallery.seq);
            }

            //최대 20개 이미지 선택
            if (MAX_SELECT > prev?.length) {
                return [...prev, gallery];
            }

            //상태에 따른 스낵바를 출력
            setSnackbar({
                message: '20개를 초과하여 선택할 수 없습니다.',
                visible: true
            });

            return prev;
        });
    }, [selectGalleries, isDeleteMode]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });

        //선택된 이미지가 있다면
        if (result.assets) {
            console.log(result.assets)

            //선택된 이미지들을 서버로 전송한다
            await Gallery.registerGallery(room, result.assets);

            //완료되었다면 리스트를 다시 가져온다
            await readGalleryList();
        }

    };

    const deleteImage = async () => {
        let message = '';

        //현재 삭제 여부 상태 확인
        if (isDeleteMode) {
            //삭제할 이미지 선택 여부
            if (selectGalleries.length === 0) {
                message = '이미지가 선택되지 않았습니다.';
            } else {
                await Gallery.removeGallery(selectGalleries);
                message = '선택한 이미지가 삭제되었습니다.';
                await readGalleryList();
            }
        } else {
            message = `최대 ${MAX_SELECT}개의 삭제할 이미지를 선택해주세요.`;
            setSelectGalleries([]);
        }

        //상태에 따른 스낵바를 출력
        setSnackbar({
            message,
            visible: true
        });

        setIsDeleteMode(prev => !prev);
    };

    if (isLoading)
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size='large' color={PRIMARY.DEFAULT} />
            </View>
        );
    return (
        <View style={styles.container}>
            {/*//추모관 개설자는 이미지를 추가하거나 삭제할 수 있다*/
                user.id === room.id &&
                <View style={styles.listHeader}>
                    <Button style={{ flex: 1, marginHorizontal: 10 }} icon='camera' mode='contained'
                            onPress={pickImage}>추가</Button>
                    <Button style={{ flex: 1, marginHorizontal: 10 }} icon={isDeleteMode ? 'check' : 'delete'}
                            mode='contained' onPress={deleteImage}>{isDeleteMode ? '선택' : '삭제'}</Button>
                </View>
            }

            {galleries.length === 0 ?
                <View style={styles.text}>
                    <Text>등록된 이미지가 없습니다</Text>
                </View>
                :
                <MasonryList
                    contentContainerStyle={{
                        padding: 5,
                        alignSelf: 'stretch',
                    }}
                    data={galleries}
                    keyExtractor={(item) => item.seq}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, i }) => <GalleryItem item={item}
                                                              onPress={() => isDeleteMode ? onToggleImage(item) : onPressImage(i)}
                                                              isSelected={isSelectedGallery(item)}
                                                              isDeleteMode={isDeleteMode} />}
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
        backgroundColor: WHITE
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    text: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default GalleryScreen;
