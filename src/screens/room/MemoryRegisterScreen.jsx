import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GRAY, PRIMARY } from '../../Colors';
import { StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import HeaderRight from '../../components/view/HeaderRight';
import * as Memory from '../../api/Memory';
import { DIALOG_MODE } from '../../components/message/CustomDialog';
import { useDialogState } from '../../contexts/DialogContext';
import { useMemoryState } from '../../contexts/MemoryContext';
import { ReturnKeyTypes } from '../../components/view/Input';
import { IconButton, Text } from 'react-native-paper';


const MemoryRegisterScreen = () => {
    const { params } = useRoute();
    const { uri, room } = params;

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();

    const video = useRef(null);

    const [comment, setComment] = useState('');
    const [, setDialog] = useDialogState();

    const [, setMemory] = useMemoryState();


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
            comment: comment,
            type: 2
        };

        console.log('memory 1 : ', memory);

        await Memory.registerVideo(memory, uri, imageUri);

        setDialog({
            visible: false
        });

        setMemory(memory);
        console.log('memory 2 : ', memory);

        // navigation.goBack({memory:memory })
        navigation.goBack();
    }, [navigation, setDialog, Memory, VideoThumbnails, uri, comment]);

    return (
        <View style={styles.container}>
            <View style={{ width: width, height: 0.5, backgroundColor: GRAY.LIGHT }} />

            <TextInput style={{ width: '100%', padding: 16, flex: 1, textAlignVertical: 'top' }}
                       placeholder='추억의 말을 입력해주세요.'
                       multiline={true}
                       onSubmitEditing={registerMemory}
                       returnKeyType={ReturnKeyTypes.DONE}
                       onChangeText={setComment}
                       value={comment}
                       cursorColor={PRIMARY.DEFAULT}
                       selectionColor={PRIMARY.DEFAULT}
            />

            <View style={{
                width: width,
                height: 36,
                backgroundColor: GRAY.SOFT,
                borderWidth: 0.5,
                borderColor: GRAY.LIGHT,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row'
            }}>
                <IconButton icon={'cancel'} size={20} iconColor={PRIMARY.DEFAULT} onPress={() => setComment('')} disabled={comment.length === 0}/>

                <Text variant='bodyMedium' style={{ marginEnd: 10 }}>{comment.length} / 300</Text>

            </View>

            <Video
                ref={video}
                source={{ uri: uri }}
                style={{ width: '100%', height: 200, backgroundColor: GRAY.DARK }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
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
