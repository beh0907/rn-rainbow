import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-paper';
import * as Memory from '../../api/Memory';
import { useRoomState } from '../../contexts/RoomContext';
import { PRIMARY, WHITE } from '../../Colors';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FlashList } from '@shopify/flash-list';
import MemoryItem from '../../components/item/MemoryItem';
import CommentItem from '../../components/item/CommentItem';

const RoomScreen = () => {
    const [room] = useRoomState();

    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();

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
                    estimatedListSize={{ width, height }}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    // style={styles.commentList}
                    // contentContainerStyle={styles.commentList}
                    ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                    keyExtractor={(item) => item.seq}
                    data={memories}
                    renderItem={({ item }) =>
                        //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
                        <MemoryItem memory={item} />
                    }
                />
            }
        </View>
    );
};

RoomScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: WHITE
    }
});

export default RoomScreen;
