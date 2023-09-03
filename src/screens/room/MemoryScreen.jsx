import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRoomState } from '../../contexts/RoomContext';
import { PRIMARY, WHITE } from '../../Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useUserState } from '../../contexts/UserContext';
import { RoomRoutes } from '../../navigations/Routes';
import { Tabs } from 'react-native-collapsible-tab-view';
import * as Memory from '../../api/Memory';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { useDialogState } from '../../contexts/DialogContext';
import MemoryItem from '../../components/item/MemoryItem';


const MemoryScreen = () => {
    const [user] = useUserState();
    const [room] = useRoomState();
    const [, setSnackbar] = useSnackBarState();
    const [, setDialog] = useDialogState();

    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();
    const {params} = useRoute()
    const { width, height } = useWindowDimensions();

    //무한 스크롤 페이징 처리 관련 변수들
    const [refetching, setRefetching] = useState(false);
    const [amount, setAmount] = useState(20);
    const isFetch = useRef(true);
    const pageRef = useRef(1);

    useEffect(() => {
        if (params?.memory) {
            console.log("메모리가 도착했어요 : ", params?.memory)
            // setMemories(prev => ([params?.memory, prev]))
        }
    }, [params?.memory]);

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
            const list = await Memory.readMemoryList(room.roomNum, 2, { page: pageRef.current, amount }); //type 1 = 이미지, 2 = 비디오

            //페이지당 amount만큼 가져오지만 amount와 개수가 다를 경우 마지막 페이지임을 인식
            if (list.length !== amount) {
                isFetch.current = false;
            }

            //새로 가져온 추모관이 하나라도 있다면 리스트에 추가한다
            // if (list.length > 0) {
                // 새로고침이라면 새로 추가하고 아니라면 배열을 합친다
                if (isRefetch === true) setMemories(list);
                else setMemories(prev => [...prev, ...list]);

                pageRef.current++;
            // }


        }
    }, [isFetch.current, pageRef.current, amount, setMemories]);

    const pickVideo = useCallback(async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            // allowsMultipleSelection:true,
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1
        });

        if (result.assets) {
            navigation.navigate(RoomRoutes.MEMORY_REGISTER, {
                uri: result.assets[0].uri,
                room
            });
        }
    }, []);

    const removeMemory = useCallback(async (memory) => {
        setDialog({
            title: '추억의 영상 삭제',
            message: '정말 추억의 영상을 삭제하시겠습니까?',
            onPress: async () => {
                const result = await Memory.removeMemory(memory);
                setSnackbar({
                    message: (result !== null ? '추억의 영상이 삭제되었습니다.' : '통신 오류로 인해 추억의 영상 삭제를 실패하였습니다.'),
                    visible: true
                });
                await refetch();
            },
            visible: true,
            isConfirm: true
        });
    }, []);

    if (isLoading)
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size='large' color={PRIMARY.DEFAULT} />
            </View>
        );
    return (
        <View style={styles.container}>
            {memories.length === 0 ?
                <Tabs.ScrollView
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 0
                    }}
                    showsVerticalScrollIndicator={false}>
                    <Text>등록된 추억이 없습니다</Text>
                </Tabs.ScrollView>
                :
                <Tabs.FlashList
                    extraData={refetching}
                    estimatedListSize={{ width, height }}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.memoryList}
                    ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                    // keyExtractor={(item, index) => index.toString()}
                    data={memories}
                    renderItem={({ item }) =>
                        //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
                        <MemoryItem memory={item} removeMemory={removeMemory} />
                    }
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
                    <IconButton style={{ marginHorizontal: 10 }} icon={'plus'} containerColor={PRIMARY.DEFAULT}
                                iconColor={WHITE}
                                mode='contained' onPress={pickVideo} />
                </View>
            }
        </View>
    );
};

MemoryScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    separator: {
        // marginVertical: 10
    },
    memoryList: {
        paddingBottom: 10
    },
    listFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default MemoryScreen;
