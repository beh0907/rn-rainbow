import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { readMemoryList } from '../../api/Memory';
import { useRoomState } from '../../contexts/RoomContext';
import { ResizeMode, Video } from 'expo-av';
import { WHITE } from '../../Colors';
import Constants from 'expo-constants';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const RoomScreen = () => {
    const [room] = useRoomState();
    const [memories, setMemories] = useState([]);

    //비디오 객체
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});


    useEffect(() => {
        (async () => {
            setMemories(await readMemoryList(room.roomNum, 2)); // 1은 이미지 2는 비디오 메모리
        })();
    }, []);

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
