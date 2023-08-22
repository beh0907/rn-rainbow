import React, { memo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import Constants from 'expo-constants';
import { Surface, Text } from 'react-native-paper';
import { GRAY, WHITE } from '../../Colors';
import { MaterialIcons } from '@expo/vector-icons';
import ViewMoreText from 'react-native-view-more-text';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const MemoryItem = memo(({ memory }) => {
    //비디오 객체
    const video = useRef(null);
    const [status, setStatus] = useState({});


    console.log("메모리", memory)

    return (
        <Surface style={styles.container} elevation={5}>
            <View style={{ flexDirection: 'row' }}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: `${BASE_URL_FILE}${memory.id}/${memory.roomNum}/memory/${memory.type}/${memory.name}`
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    // onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            </View>

            <ViewMoreText
                numberOfLines={3}
                renderViewMore={(onPress) =>
                    <Pressable style={styles.containerCollapse} onPress={onPress}>
                        <Text style={styles.commentCollapse}>더보기</Text>
                        <MaterialIcons name={'expand-more'} size={20} color={GRAY.DEFAULT} />
                    </Pressable>
                }
                renderViewLess={(onPress) =>
                    <Pressable style={styles.containerCollapse} onPress={onPress}>
                        <Text style={styles.commentCollapse}>접기</Text>
                        <MaterialIcons name={'expand-less'} size={20} color={GRAY.DEFAULT} />
                    </Pressable>
                }
                textStyle={styles.commentContent}>
                <Text>
                    {memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}
                    {memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}
                    {memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}{memory.comment}
                </Text>
            </ViewMoreText>
        </Surface>
    );
});

MemoryItem.propTypes = {};

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: WHITE,
            padding: 16,
        },
        video: {
            alignSelf: 'center',
            height: 200,
            flex: 1,
            // borderRadius: 20
        },
        containerCollapse: {
            flexDirection: 'row',
            marginTop: 10,
            marginEnd: 10,
            alignSelf: 'flex-end'
        },
        commentCollapse: {
            color: GRAY.DEFAULT
        },
        commentContent: {
            fontSize: 14,
            flexWrap: 'wrap',
            paddingVertical: 10
        }
    }
);

export default MemoryItem;
