import React, { memo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import Constants from 'expo-constants';
import { Text } from 'react-native-paper';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const MemoryItem = memo(({ memory }) => {
    //비디오 객체
    const video = useRef(null);
    const [status, setStatus] = useState({});

    console.log(status);

    return (
        <View style={styles.container}>
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

            {/*<Card>*/}
            {/*    <Card.Content style={{ flexDirection: 'row' }}>>*/}
            {/*        <Video*/}
            {/*            ref={video}*/}
            {/*            style={styles.video}*/}
            {/*            source={{*/}
            {/*                uri: `${BASE_URL_FILE}${memory.id}/${memory.roomNum}/memory/${memory.type}/${memory.name}`*/}
            {/*            }}*/}
            {/*            useNativeControls*/}
            {/*            resizeMode={ResizeMode.CONTAIN}*/}
            {/*            onPlaybackStatusUpdate={status => setStatus(() => status)}*/}
            {/*        />*/}
            {/*    </Card.Content>*/}
            {/*</Card>*/}

            <Text
                numberOfLines={0}
                onTextLayout={({ nativeEvent: { lines } }) =>
                    console.log('lines', lines.length)
                }
                style={styles.content}>{memory.comment}</Text>
        </View>
    );
});

MemoryItem.propTypes = {};

const styles = StyleSheet.create({
        container: {
            flex: 1
        },
        video: {
            alignSelf: 'center',
            height: 200,
            flex: 1,
            borderRadius: 20
        },
        content: {
            marginTop: 10
        }
    }
);

export default MemoryItem;
