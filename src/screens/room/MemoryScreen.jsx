import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, StyleSheet, useWindowDimensions, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import * as Memory from '../../api/Memory';
import { useRoomState } from '../../contexts/RoomContext';
import { PRIMARY, WHITE } from '../../Colors';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FlashList } from '@shopify/flash-list';
import MemoryItem from '../../components/item/MemoryItem';
import { useUserState } from '../../contexts/UserContext';


const MemoryScreen = () => {
    const [user] = useUserState();
    const [room] = useRoomState();

    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();

    const listRef = useRef(null)

    // Create a clock for animation

    useLayoutEffect(() => {
        (async () => {
            await readMemoryList();
        })();
    }, []);

    const readMemoryList = useCallback(async () => {
        setIsLoading(true);

        const list = await Memory.readMemoryList(room.roomNum, 2); //type 1 = 이미지, 2 = 비디오

        navigation.setOptions({
            tabBarLabel: `추억의 말 ${list.length}`
        });

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
            // setImage(result.assets[0].uri);
        }
    }, []);

    const test = async () => {
        setMemories(prev => [
            {
                seq:6,
                id: 'beh0907',
                roomNum: 4,
                comment: `테스트 ${prev.length} : ${room.roomNum}`,
                type: 2,
                name: '1683460997263_dc601a476ef9ca225dcb4aacf493008e.mp4'
            },
            ...memories
        ]);

        // This must be called before `LayoutAnimation.configureNext` in order for the animation to run properly.
        listRef.current?.prepareForLayoutAnimationRender();
        // After removing the item, we can start the animation.
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);


        //최상단으로 강제 이동
        listRef.current.scrollToOffset({ animated: true, offset: 0 });
    };



    if (isLoading)
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size='large' color={PRIMARY.DEFAULT} />
            </View>
        );
    return (
        <View style={[styles.container]}>
            {memories.length === 0 ?
                <Text>등록된 추억이 없습니다</Text>
                :
                <FlashList
                    ref={listRef}
                    estimatedListSize={{ width, height }}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    // style={styles.commentList}
                    // contentContainerStyle={styles.commentList}
                    ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                    keyExtractor={(item, index) => index}
                    data={memories}
                    renderItem={({ item }) =>
                        //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
                        <MemoryItem memory={item} />
                    }
                />
            }

            {/*//추모관 개설자는 이미지를 추가하거나 삭제할 수 있다*/
                user.id === room.id &&
                <View style={styles.buttonContainer}>
                    <IconButton style={{ marginHorizontal: 10 }} icon={'cancel'} containerColor={PRIMARY.DEFAULT}
                                iconColor={WHITE}
                                mode='contained' onPress={test} />
                    <IconButton style={{ marginHorizontal: 10 }} icon={'plus'} containerColor={PRIMARY.DEFAULT}
                                iconColor={WHITE}
                                mode='contained' onPress={test} />
                </View>
            }
        </View>
    );
};

MemoryScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        // backgroundColor: WHITE
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    separator: {
        marginVertical:5
    }
});

export default MemoryScreen;
