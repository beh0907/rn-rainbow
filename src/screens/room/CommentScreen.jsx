import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useUserState } from '../../contexts/UserContext';
import { useRoomState } from '../../contexts/RoomContext';
import CommentItem from '../../components/item/CommentItem';
import * as Comment from '../../api/Comment';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { Text, TextInput } from 'react-native-paper';
import { ReturnKeyTypes } from '../../components/view/Input';
import { useDialogState } from '../../contexts/DialogContext';

const CommentScreen = () => {
    const [user] = useUserState();
    const [room] = useRoomState();
    const [snackBar, setSnackbar] = useSnackBarState();
    const [dialog, setDialog] = useDialogState();

    const [comments, setComments] = useState({});
    const [comment, setComment] = useState('');

    const readCommentList = useCallback(async () => {
        setComments(await Comment.readCommentList(room.roomNum));
        console.log('밸류', comments);
    }, [])

    const removeComment = useCallback(async ({ seq }) => {
        console.log('seq', seq);

        setDialog({
            title: '댓글 삭제',
            message: '정말 댓글을 삭제하시겠습니까?',
            onPress: async () => {
                const result = await Comment.removeComment(seq);
                setSnackbar({
                    message: (result !== null ? '댓글이 삭제되었습니다.' : '통신 오류로 인해 댓글 삭제를 실패하였습니다.'),
                    visible: true
                });
                await readCommentList()
            },
            visible: true
        });


    }, []);

    useEffect(() => {
        (async () => {
            await readCommentList()
        })();
    }, [snackBar]);

    return (
        <View style={[styles.container]}>
            <FlatList
                style={styles.commentList}
                ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                keyExtractor={(item) => item.seq}
                data={comments}
                renderItem={({ item }) => <CommentItem comment={item} isMine={user.id === item.userId}
                                                       removeComment={removeComment} />}
            />


            {/* 댓글 작성 입력창 */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    mode='outlined'
                    outlineStyle={{ borderWidth: 1 }}
                    outlineColor='#0000001F'
                    label='댓글 작성'
                    style={styles.commentInput}
                    returnKeyType={ReturnKeyTypes.DONE}
                    onChangeText={setComment}
                    value={comment}
                />
                <TouchableOpacity style={styles.postButton} onPress={() => {
                }}>
                    <Text style={styles.postButtonText}>작성</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

CommentScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentList: {
        flex: 1,
        width: '100%'
    },
    separator: {
        marginVertical: 16
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16
    },
    commentInput: {
        flex: 1
    },
    postButton: {
        marginLeft: 12,
        backgroundColor: '#007bff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8
    },
    postButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default CommentScreen;
