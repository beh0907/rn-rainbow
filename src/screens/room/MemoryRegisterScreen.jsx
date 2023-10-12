import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { GRAY, PRIMARY } from '../../Colors';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { ReturnKeyTypes } from '../../components/view/Input';
import * as VideoThumbnails from 'expo-video-thumbnails';
import HeaderRight from '../../components/view/HeaderRight';
import * as Memory from '../../api/Memory';
import { DIALOG_MODE } from '../../components/message/CustomDialog';
import { useDialogState } from '../../contexts/DialogContext';
import { MainRoutes, RoomRoutes } from '../../navigations/Routes';


const MemoryRegisterScreen = ({ route }) => {
    const { params } = useRoute();
    const { uri, room } = params;

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();

    const video = useRef(null);

    const [comment, setComment] = useState('');
    const [, setDialog] = useDialogState();

    console.log(params);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRight disabled={!(comment.length > 0)} onPress={registerMemory} name={'check'}
                                            color={comment.length > 0 ? PRIMARY.DEFAULT : GRAY.DEFAULT} />
        });
    }, [navigation, comment]);

    const registerMemory = useCallback(async () => {
        setDialog({
            message: '동영상을 업로드 하고 있습니다.....',
            visible: true,
            mode: DIALOG_MODE.LOADING
        });

        const { uri: imageUri } = await VideoThumbnails.getThumbnailAsync(
            uri, {
                time: 0 // 썸네일을 얻고자 하는 시간 (0은 처음)
            }
        );

        const memory = {
            id: room.id,
            roomNum: room.roomNum,
            comment,
            type: 2
        };

        await Memory.registerVideo(memory, uri, imageUri);

        setDialog({
            visible: false
        });

        // navigation.goBack({memory:memory })
        navigation.goBack();
    }, [navigation, setDialog, Memory, VideoThumbnails, uri]);

    return (
        <View style={styles.container}>

            <Video
                ref={video}
                source={{ uri: uri }}
                style={{ width: '100%', height: 200, backgroundColor: GRAY.DARK }}
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

            <View style={{ width: '100%', padding: 16, flex: 1 }}>
                <TextInput
                    mode={'outlined'}
                    outlineStyle={{ borderWidth: 1 }}
                    outlineColor='#0000001F'
                    label='추억의 말'
                    value={comment}
                    multiline={true}
                    numberOfLines={30}
                    style={{ width: '100%', flex: 1 }}
                    onSubmitEditing={registerMemory}
                    returnKeyType={ReturnKeyTypes.DONE}
                    onChangeText={setComment}
                />
            </View>
        </View>
    );
};

MemoryRegisterScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    video: {
        backgroundColor: 'yellow',
        height: 200,
        width: '100%',
        flex: 1
        // borderRadius: 20
    }

});

export default MemoryRegisterScreen;
