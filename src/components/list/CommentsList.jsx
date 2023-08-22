import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import useComments from '../../hooks/UseComments';
import CommentItem from '../item/CommentItem';
import * as Comment from '../../api/Comment';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { useDialogState } from '../../contexts/DialogContext';

const CommentsList = forwardRef(({ user, num, room }, ref) => {
    const [, setSnackbar] = useSnackBarState();
    const [, setDialog] = useDialogState();

    const { width, height } = useWindowDimensions();

    const {
        comments,
        fetchNextPage,
        refetch,
        refetching,
        isLoading
    } = useComments(num);

    useImperativeHandle(ref, () => ({
        // CommentsList 컴포넌트에 접근하여 호출할 함수들을 노출
        refetch,
    }));

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
            visible: true
        });
    }, []);


    const renderItem = useCallback(({ item }) => {
        //댓글 작성자이거나 추모관 개설자는 댓글을 삭제할 수 있다
        return <CommentItem comment={item} isCanDelete={user.id === item.userId || user.id === room.id}
                            removeComment={removeComment} />;
    }, [removeComment, user, room]);

    const ItemSeparatorComponent = useCallback(() => {
        return <View style={styles.separator} />;
    }, []);

    const keyExtractor = useCallback((item, index) => index.toString(), []);

    // FlatList를 감싸는 새로운 컴포넌트를 만듭니다.
    return (
        <FlashList
            estimatedListSize={{ width, height }}
            estimatedItemSize={92}
            showsVerticalScrollIndicator={false}
            // style={styles.commentList}
            // contentContainerStyle={styles.commentList}
            ItemSeparatorComponent={ItemSeparatorComponent}
            keyExtractor={keyExtractor}
            data={comments}
            renderItem={renderItem}
            onEndReached={fetchNextPage}
            refreshing={refetching}
            onRefresh={refetch}
            ListFooterComponent={isLoading && <Text>목록을 불러오고 있습니다.</Text>}
            ListFooterComponentStyle={styles.listFooter}
        />
    );
});

// CommentsList.propTypes = {
//     user: PropTypes.object.isRequired,
//     num: PropTypes.number.isRequired,
// };

const styles = StyleSheet.create({
    container: {
        // paddingTop:10
    },
    separator: {
        marginVertical: 16
    },
    listFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CommentsList;
