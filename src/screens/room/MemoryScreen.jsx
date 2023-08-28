import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRoomState } from '../../contexts/RoomContext';
import { PRIMARY, WHITE } from '../../Colors';
import { useNavigation } from '@react-navigation/native';
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
    const { width, height } = useWindowDimensions();

    const listRef = useRef(null);

    useLayoutEffect(() => {
        (async () => {
            await readMemoryList();
        })();
    }, []);

    const readMemoryList = useCallback(async () => {
        setIsLoading(true);

        const list = await Memory.readMemoryList(room.roomNum, 2); //type 1 = 이미지, 2 = 비디오

        setMemories(list);

        setIsLoading(false);
    }, [navigation, isLoading, memories]);

    const pickVideo = useCallback(async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            // allowsMultipleSelection:true,
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1
        });

        if (result.assets) {
            console.log('result : ', result);
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
                await readMemoryList();
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
        <View style={[styles.container]}>
            {memories.length === 0 ?
                <Tabs.ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                                 showsVerticalScrollIndicator={false}>
                    <Text style={{ position: 'absolute', top: '50%' }}>등록된 추억이 없습니다</Text>
                </Tabs.ScrollView>
                :
                <Tabs.FlashList
                    ref={listRef}
                    // estimatedListSize={{ width, height }}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.memoryList}
                    ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                    keyExtractor={(item, index) => index.toString()}
                    data={memories}
                    renderItem={({ item }) =>
                        //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
                        <MemoryItem memory={item} removeMemory={removeMemory} />
                    }
                    refreshing={isLoading}
                    onRefresh={readMemoryList}
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
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    separator: {
        marginVertical: 10
    },
    memoryList: {
        paddingVertical: 20
    }
});

export default MemoryScreen;
