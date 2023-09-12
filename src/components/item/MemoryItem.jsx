import React, { memo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import Constants from 'expo-constants';
import { IconButton, Paragraph, Surface, Text } from 'react-native-paper';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import { MaterialIcons } from '@expo/vector-icons';
import ViewMoreText from 'react-native-view-more-text';
import { calculateTimeDifference } from '../../utils/DateUtil';

const { BASE_URL_FILE } = Constants.expoConfig.extra;


const MemoryItem = memo(({ memory, removeMemory }) => {
    //비디오 객체
    return (
        <Surface style={styles.container} elevation={3}>
            <View style={{ flexDirection: 'row' }}>
                <Video
                    // isLooping={true}
                    style={styles.video}
                    source={{
                        uri: `${BASE_URL_FILE}${memory.id}/${memory.roomNum}/memory/${memory.type}/${memory.name}`
                    }}
                    useNativeControls
                    // resizeMode={isFullScreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
                    resizeMode={ResizeMode.CONTAIN}
                    // onPlaybackStatusUpdate={status => setState(() => status)}
                    // onFullscreenUpdate={event => setIsFullScreen(() => event.fullscreenUpdate <= 1)}
                />
            </View>

            <View style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginStart: 16
            }}>
                <Text style={styles.memoryDate}>{calculateTimeDifference(memory.date)}</Text>

                <IconButton mode={'outlined'} icon={'delete'} iconColor={PRIMARY.DEFAULT}
                            size={24} onPress={() => removeMemory(memory)} />
            </View>

            <ViewMoreText
                numberOfLines={3}
                renderViewMore={(onPress) =>
                    <Pressable style={styles.containerCollapse} onPress={onPress}>
                        <Text style={styles.memoryCollapse}>더보기</Text>
                        <MaterialIcons name={'expand-more'} size={20} color={GRAY.DEFAULT} />
                    </Pressable>
                }
                renderViewLess={(onPress) =>
                    <Pressable style={styles.containerCollapse} onPress={onPress}>
                        <Text style={styles.memoryCollapse}>접기</Text>
                        <MaterialIcons name={'expand-less'} size={20} color={GRAY.DEFAULT} />
                    </Pressable>
                }
                textStyle={styles.memoryContent}>
                <Paragraph>
                    {memory.comment}
                </Paragraph>
            </ViewMoreText>
        </Surface>
    );
});

MemoryItem.propTypes = {};

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: WHITE,
            marginHorizontal: 10,
            paddingBottom: 10,
            marginTop: 10,
            borderRadius: 16
        },
        video: {
            alignSelf: 'center',
            height: 200,
            flex: 1,
            backgroundColor: GRAY.DARK,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16
            // borderRadius: 20
        },
        containerCollapse: {
            flexDirection: 'row',
            marginTop: 10,
            marginStart: 16,
            alignSelf: 'flex-start'
        },
        memoryCollapse: {
            color: GRAY.DEFAULT
        },
        memoryContent: {
            fontSize: 14,
            flexWrap: 'wrap',
            marginVertical: 10,
            marginHorizontal: 16
        },
        memoryDate: {
            fontSize: 12,
            color: '#000000',
            marginBottom: 4
        }
    }
);

export default MemoryItem;
