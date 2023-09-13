import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useUserState } from '../../contexts/UserContext';
import { useRoomState } from '../../contexts/RoomContext';
import CommentItem from '../../components/item/CommentItem';
import * as Comment from '../../api/Comment';
import { readCommentList } from '../../api/Comment';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { useDialogState } from '../../contexts/DialogContext';
import InputTextButton from '../../components/view/inputTextButton';
import { Text } from 'react-native-paper';
import { PRIMARY, WHITE } from '../../Colors';

import { Tabs, useHeaderMeasurements } from 'react-native-collapsible-tab-view';
import { DIALOG_MODE } from '../../components/message/CustomDialog';

const CommentScreen = () => {
    const [user] = useUserState();
    const [room] = useRoomState();
    const [, setSnackbar] = useSnackBarState();
    const [, setDialog] = useDialogState();

    const [comments, setComments] = useState([]);
    const [addComment, setAddComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { width, height } = useWindowDimensions();

    //무한 스크롤 페이징 처리 관련 변수들
    const [refetching, setRefetching] = useState(false);
    const [amount, setAmount] = useState(100);
    const isFetch = useRef(true);
    const pageRef = useRef(1);

    const { top } = useHeaderMeasurements()

    useLayoutEffect(() => {
        (async () => {
            await refetch();
            setIsLoading(false);
        })();
    }, []);

    const refetch = useCallback(async () => {
        setRefetching(true);

        pageRef.current = 1;
        isFetch.current = true;

        await fetchNextPage(true);

        setRefetching(false);
    }, []);

    const fetchNextPage = useCallback(async (isRefetch) => {

        if (isFetch.current) {
            //페이지와 개수 정보를 파라미터로 입력한다
            const list = await readCommentList(room.roomNum, { page: pageRef.current, amount, type: '' });

            //페이지당 amount만큼 가져오지만 amount와 개수가 다를 경우 마지막 페이지임을 인식
            if (list.length !== amount) {
                isFetch.current = false;
            }

            //새로 가져온 추모관이 하나라도 있다면 리스트에 추가한다
            // if (list.length > 0) {
            // 새로고침이라면 새로 추가하고 아니라면 배열을 합친다
            if (isRefetch === true) setComments(list);
            else setComments(prev => [...prev, ...list]);

            pageRef.current++;
            // }
        }
    }, [isFetch.current, readCommentList, pageRef.current, amount, setComments]);

    const registerComment = async () => {
        Keyboard.dismiss();

        //댓글 등록
        await Comment.registerComment({
            roomNum: room.roomNum,
            userId: user.id,
            content: addComment,
            emoticon: 1
        });

        // 등록 완료 안내 스낵바
        setSnackbar({
            message: '댓글이 등록되었습니다.',
            visible: true
        });
        setAddComment('');

        //등록 후 리로드
        await refetch();
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
                await refetch();
            },
            visible: true,
            mode: DIALOG_MODE.CONFIRM
        });
    }, [comments, setSnackbar, refetch]);

    if (isLoading)
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size='large' color={PRIMARY.DEFAULT} />
            </View>
        );

    return (
        <View style={styles.container}>
            {/*로딩 중일때는 인디케이터 표시*/}
            {comments.length === 0 ?
                <Tabs.ScrollView
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 0
                    }}
                    showsVerticalScrollIndicator={false}>
                    <Text>등록된 댓글이 없습니다</Text>
                </Tabs.ScrollView>
                :
                <View style={{ flex: 1, marginTop: 16}}>
                    <Tabs.FlatList
                        extraData={refetching}
                        estimatedListSize={{ width, height }}
                        estimatedItemSize={92}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.commentList}
                        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                        keyExtractor={(_, index) => index.toString()}
                        data={comments}
                        renderItem={({ item }) =>
                            //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
                            <CommentItem comment={item} isCanDelete={user.id === item.userId || user.id === room.id}
                                         removeComment={removeComment} />
                        }
                        onEndReachedThreshold={0.9}
                        onEndReached={() => fetchNextPage(false)}
                        refreshing={refetching}
                        onRefresh={refetch}
                        ListFooterComponent={refetching && <Text>목록을 불러오고 있습니다.</Text>}
                        ListFooterComponentStyle={styles.listFooter}
                    />
                </View>
            }


            {/*댓글 작성 입력창*/}
            <InputTextButton
                value={addComment} onChangeText={setAddComment} icon={'send'}
                placeholder={'댓글을 입력해주세요.'} onSubmit={registerComment} disabled={addComment === ''}
                styles={{
                    input: {
                        position:'absolute',
                        margin: 16,
                        bottom:0
                    }
                }} />
        </View>
    );

    // return (
    //     <View style={styles.container}>
    //         {/*로딩 중일때는 인디케이터 표시*/}
    //         {comments.length === 0 ?
    //             <Tabs.ScrollView
    //                 contentContainerStyle={{
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                     paddingTop: 0
    //                 }}
    //                 showsVerticalScrollIndicator={false}>
    //                 <Text>등록된 댓글이 없습니다</Text>
    //             </Tabs.ScrollView>
    //             :
    //             <View style={{ flex: 1, marginTop: 16}}>
    //                 <Tabs.FlashList
    //                     extraData={refetching}
    //                     estimatedListSize={{ width, height }}
    //                     estimatedItemSize={92}
    //                     showsVerticalScrollIndicator={false}
    //                     contentContainerStyle={styles.commentList}
    //                     ItemSeparatorComponent={() => <View style={styles.separator}></View>}
    //                     keyExtractor={(_, index) => index.toString()}
    //                     data={comments}
    //                     renderItem={({ item }) =>
    //                         //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
    //                         <CommentItem comment={item} isCanDelete={user.id === item.userId || user.id === room.id}
    //                                      removeComment={removeComment} />
    //                     }
    //                     onEndReachedThreshold={0.9}
    //                     onEndReached={() => fetchNextPage(false)}
    //                     refreshing={refetching}
    //                     onRefresh={refetch}
    //                     ListFooterComponent={refetching && <Text>목록을 불러오고 있습니다.</Text>}
    //                     ListFooterComponentStyle={styles.listFooter}
    //                 />
    //             </View>
    //         }
    //
    //
    //         {/*댓글 작성 입력창*/}
    //         <InputTextButton
    //             value={addComment} onChangeText={setAddComment} icon={'send'}
    //             placeholder={'댓글을 입력해주세요.'} onSubmit={registerComment} disabled={addComment === ''}
    //             styles={{
    //                 input: {
    //                     margin: 16
    //                 }
    //             }} />
    //     </View>
    // );
};

CommentScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE
    },
    separator: {
        marginVertical: 16
    },
    commentList: {
        padding: 16,
        paddingBottom:84
    },
    listFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CommentScreen;
