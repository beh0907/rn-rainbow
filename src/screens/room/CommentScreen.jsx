import React, { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { useUserState } from '../../contexts/UserContext';
import { useRoomState } from '../../contexts/RoomContext';
import CommentItem from '../../components/item/CommentItem';
import * as Comment from '../../api/Comment';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { useDialogState } from '../../contexts/DialogContext';
import InputTextButton from '../../components/view/inputTextButton';
import { Text } from 'react-native-paper';

const CommentScreen = () => {
    const [user] = useUserState();
    const [room] = useRoomState();
    const [, setSnackbar] = useSnackBarState();
    const [, setDialog] = useDialogState();

    const [comments, setComments] = useState({});
    const [comment, setComment] = useState('');

    const readCommentList = useCallback(async () => {
        setComments(await Comment.readCommentList(room.roomNum));
    }, []);

    const registerComment = async () => {
        Keyboard.dismiss();

        //댓글 등록
        await Comment.registerComment({
            roomNum: room.roomNum,
            userId: user.id,
            content: comment,
            emoticon: 1
        });

        // 등록 완료 안내 스낵바
        setSnackbar({
            message: '댓글이 등록되었습니다.',
            visible: true
        });
        setComment('');

        //등록 후 리로드
        await readCommentList();
    };

    const removeComment = useCallback(async ({ seq }) => {
        setDialog({
            title: '댓글 삭제',
            message: '정말 댓글을 삭제하시겠습니까?',
            onPress: async () => {
                const result = await Comment.removeComment(seq);
                setSnackbar({
                    message: (result !== null ? '댓글이 삭제되었습니다.' : '통신 오류로 인해 댓글 삭제를 실패하였습니다.'),
                    visible: true
                });
                await readCommentList();
            },
            visible: true
        });
    }, []);

    useLayoutEffect(() => {
        (async () => {
            await readCommentList();
        })();
    }, []);

    return (
        <View style={[styles.container]}>

            {comments.length === 0 ?
                <View style={styles.emptyComment}>
                    <Text>등록된 댓글이 없습니다</Text>
                </View>
                :
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.commentList}
                    ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                    keyExtractor={(item) => item.seq}
                    data={comments}
                    renderItem={({ item }) =>
                        //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
                        <CommentItem comment={item} isCanDelete={user.id === item.userId || user.id === room.id}
                                     removeComment={removeComment} />
                    }
                />
            }

            {/*댓글 작성 입력창*/}
            <InputTextButton
                value={comment} onChangeText={setComment} icon={'send'}
                placeholder={'댓글을 입력해주세요.'} onSubmit={registerComment} disabled={comment === ''}
                styles={{
                    input: {
                        marginTop: 10
                    }
                }} />
        </View>
    );
};

CommentScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
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
        marginTop: 12,
        marginStart: 10
    },
    emptyComment: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CommentScreen;
