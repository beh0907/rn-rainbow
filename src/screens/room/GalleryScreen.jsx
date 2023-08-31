import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RoomRoutes } from '../../navigations/Routes';
import GalleryItem from '../../components/item/GalleryItem';
import { useRoomState } from '../../contexts/RoomContext';
import { useUserState } from '../../contexts/UserContext';
import * as ImagePicker from 'expo-image-picker';
import * as Gallery from '../../api/Gallery';
import { IconButton } from 'react-native-paper';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { PRIMARY, WHITE } from '../../Colors';
import { Tabs } from 'react-native-collapsible-tab-view';

const GalleryScreen = () => {
    const MAX_SELECT = 20; // 이미지 추가 시 최대 선택

    //유저 및 추모관 전역 객체
    const [user] = useUserState();
    const [room] = useRoomState();

    //스낵바 알림
    const [, setSnackbar] = useSnackBarState();

    //로딩 상태
    const [isLoading, setIsLoading] = useState(true);
    //삭제 상태
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const [galleries, setGalleries] = useState([]); // 갤러리 이미지 리스트
    const [selectGalleries, setSelectGalleries] = useState([]); // 삭제를 위한 선택 이미지 리스트

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();

    //무한 스크롤 페이징 처리 관련 변수들
    const [refetching, setRefetching] = useState(false);
    const [amount, setAmount] = useState(20);
    const isFetch = useRef(true);
    const pageRef = useRef(1);

    useLayoutEffect(() => {
        (async () => {
            await refetch();
            setIsLoading(false);
        })();
    }, []);

    const refetch = useCallback(async () => {
        setRefetching(true);

        pageRef.current = 1;
        isFetch.current = true;

        await fetchNextPage(true);

        setRefetching(false);
    }, []);


    const fetchNextPage = useCallback(async (isRefetch) => {

        if (isFetch.current) {
            //페이지와 개수 정보를 파라미터로 입력한다
            // const list = await readCommentList(room.roomNum, { page: pageRef.current, amount, type: '' });
            const list = await Gallery.readGalleryList(room.roomNum, { page: pageRef.current, amount });


            //페이지당 amount만큼 가져오지만 amount와 개수가 다를 경우 마지막 페이지임을 인식
            if (list.length !== amount) {
                isFetch.current = false;
            }

            //새로 가져온 추모관이 하나라도 있다면 리스트에 추가한다
            if (list.length > 0) {
                // 새로고침이라면 새로 추가하고 아니라면 배열을 합친다
                if (isRefetch === true) setGalleries(list);
                else setGalleries(prev => [...prev, ...list]);

                pageRef.current++;
            }


        }
    }, [isFetch.current, pageRef.current, amount, setGalleries]);

    const isSelectedGallery = (gallery) => {
        return selectGalleries.findIndex((item) => item.seq === gallery.seq) > -1;
    };

    const onPressImage = useCallback((index) => {
        navigation.navigate(RoomRoutes.GALLERY_SWIPER, {
            galleries,
            position: index
        });
    }, [galleries, setIsDeleteMode, navigation]);

    const onToggleImage = useCallback((gallery) => {
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
    }, [isSelectedGallery, setSelectGalleries, setSnackbar]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });

        //선택된 이미지가 있다면
        if (result.assets) {
            //선택된 이미지들을 서버로 전송한다
            await Gallery.registerGallery(room, result.assets);

            //완료되었다면 리스트를 다시 가져온다
            await refetch();
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
                await refetch();
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

        setIsDeleteMode(!isDeleteMode);
    };

    const handleScroll = async (event) => {
        console.log('이벤트 : ', event);
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height;

        console.log('isBottom : ');

        if (isBottom)
            await fetchNextPage(false);
    };

    if (isLoading)
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size='large' color={PRIMARY.DEFAULT} />
            </View>
        );
    return (
        <View style={styles.container}>
            {galleries.length === 0 ?
                <Tabs.ScrollView
                    onScroll={({nativeEvent})=>console.log(nativeEvent)}>
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 0
                    }}
                    showsVerticalScrollIndicator={false}>
                    <Text>등록된 이미지가 없습니다</Text>
                </Tabs.ScrollView>
                :
                <Tabs.MasonryFlashList
                    extraData={[isDeleteMode, isSelectedGallery, refetching]}
                    estimatedListSize={{ width, height }}
                    estimatedItemSize={100}
                    contentContainerStyle={styles.galleryList}
                    data={galleries}
                    // keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => <GalleryItem item={item}
                                                                  onPress={isDeleteMode ? () => onToggleImage(item) : () => onPressImage(index)}
                                                                  isSelected={isSelectedGallery(item)}
                                                                  isDeleteMode={isDeleteMode} />}
                    onEndReachedThreshold={0.9}
                    onEndReached={() => fetchNextPage(false)}
                    refreshing={refetching}
                    // onRefresh={refetch}
                    ListFooterComponent={refetching && <Text>목록을 불러오고 있습니다.</Text>}
                    ListFooterComponentStyle={styles.listFooter}
                />
            }

            {/*//추모관 개설자는 이미지를 추가하거나 삭제할 수 있다*/
                user.id === room.id &&
                <View style={styles.buttonContainer}>
                    <IconButton style={{ marginHorizontal: 10 }} icon={isDeleteMode ? 'check' : 'delete'}
                                mode='contained' onPress={deleteImage} containerColor={PRIMARY.DEFAULT}
                                iconColor={WHITE} />
                    <IconButton style={{ marginHorizontal: 10 }} icon='plus' mode='contained'
                                onPress={pickImage} containerColor={PRIMARY.DEFAULT} iconColor={WHITE} />
                </View>
            }
        </View>
    );
};

GalleryScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    galleryList: {
        padding: 5
    },
    listFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default GalleryScreen;
