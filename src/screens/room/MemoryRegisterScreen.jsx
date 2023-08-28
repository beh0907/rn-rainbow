import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider, TextInput } from 'react-native-paper';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { ReturnKeyTypes } from '../../components/view/Input';
import * as VideoThumbnails from 'expo-video-thumbnails';
import HeaderRight from '../../components/view/HeaderRight';
import * as Memory from '../../api/Memory';


const MemoryRegisterScreen = () => {
    const { params } = useRoute();
    const { uri, room } = params;

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();

    const video = useRef(null);

    const [comment, setComment] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRight disabled={comment.length > 0} onPress={registerMemory} name={'check'}
                                            color={comment.length > 0 ? PRIMARY.DEFAULT : GRAY.DEFAULT} />
        });
    }, [navigation, comment]);

    const registerMemory = async () => {
        const { uri: imageUri } = await VideoThumbnails.getThumbnailAsync(
            uri, {
                time: 0 // 썸네일을 얻고자 하는 시간 (0은 처음)
            }
        );

        console.log('uri : ', uri);
        console.log('imageUri : ', imageUri);

        await Memory.registerVideo({
            id: room.id,
            roomNum: room.roomNum,
            comment,
            type: 2,
        }, uri, imageUri);

        navigation.goBack()
    };

    return (
        <View style={styles.container}>

            <Video
                ref={video}
                source={{ uri: uri }}
                style={{ width: 300, height: 200 }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
            />

            {/*<Video*/}
            {/*    ref={video}*/}
            {/*    style={styles.video}*/}
            {/*    source={{*/}
            {/*        uri*/}
            {/*    }}*/}
            {/*    useNativeControls*/}
            {/*    resizeMode={ResizeMode.CONTAIN}*/}
            {/*/>*/}

            <Divider style={[styles.divider, { width: width }]} />

            <TextInput
                mode={'outlined'}
                outlineStyle={{ borderWidth: 1 }}
                outlineColor='#0000001F'
                label='추억의 말'
                value={comment}
                multiline={true}
                numberOfLines={10}
                style={{ width: '100%' }}
                onSubmitEditing={registerMemory}
                returnKeyType={ReturnKeyTypes.DONE}
                onChangeText={setComment}
            />
        </View>
    );
};

MemoryRegisterScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:16
    },
    video: {
        backgroundColor: 'yellow',
        height: 200,
        width:'100%',
        flex: 1
        // borderRadius: 20
    },
    divider: {
        height: 100,
        backgroundColor: GRAY.LIGHT,
        marginVertical: 32
    }

});

export default MemoryRegisterScreen;
