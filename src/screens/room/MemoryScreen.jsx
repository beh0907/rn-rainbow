import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import * as Memory from '../../api/Memory';
import { useRoomState } from '../../contexts/RoomContext';
import { ResizeMode, Video } from 'expo-av';
import { PRIMARY, WHITE } from '../../Colors';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const RoomScreen = () => {
    const [room] = useRoomState();

    const [memories, setMemories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    //비디오 객체
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    const navigation = useNavigation();

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
                memories.map(memory => (
                    <View key={memory.seq} style={styles.container}>
                        <Video
                            ref={video}
                            style={styles.video}
                            source={{
                                uri: `${BASE_URL_FILE}${memory.id}/${memory.roomNum}/memory/${memory.type}/${memory.name}`
                            }}
                            useNativeControls
                            resizeMode={ResizeMode.STRETCH}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                    </View>
                ))
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
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200
    }
});

export default RoomScreen;
