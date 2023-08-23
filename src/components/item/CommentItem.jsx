import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import PropTypes from 'prop-types';
import {  MaterialIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../../Colors';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import Constants from 'expo-constants';
import ViewMoreText from 'react-native-view-more-text';
import { IconButton } from 'react-native-paper';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const CommentItem = memo(({ comment, isCanDelete, removeComment }) => {

    const calculateTimeDifference = useCallback((dateTime) => {
        const currentDateTime = new Date();
        const targetDateTime = new Date(dateTime);

        const yearDiff = currentDateTime.getFullYear() - targetDateTime.getFullYear();
        if (yearDiff > 0) return yearDiff + '년 전';

        const monthDiff = currentDateTime.getMonth() - targetDateTime.getMonth();
        if (monthDiff > 0) return monthDiff + '개월 전';

        const dayDiff = currentDateTime.getDate() - targetDateTime.getDate();
        if (dayDiff > 0) return dayDiff + '일 전';

        const hourDiff = currentDateTime.getHours() - targetDateTime.getHours();
        if (hourDiff > 0) return hourDiff + '시간 전';

        const minuteDiff = currentDateTime.getMinutes() - targetDateTime.getMinutes();
        if (minuteDiff > 0) return minuteDiff + '분 전';

        return '방금';
    }, []);

    return (
        <View style={styles.container}>
            {
                comment.image ?
                    <AvatarImage source={{ uri: `${BASE_URL_FILE}${comment.userId}/profile.jpg` }} size={48}
                                 style={styles.profileImage} />
                    : <AvatarText label={comment.nickName.charAt(0)} Text size={48}
                                  style={styles.profileImage} />
            }

            {/*<AvatarText style={styles.profileImage} label={comment.nickName.charAt(0)} Text size={36} />*/}
            <View style={styles.commentInfo}>
                <Text style={styles.nickName}>{comment.nickName}</Text>
                <Text style={styles.commentDate}>{calculateTimeDifference(comment.date)}</Text>
                {/*<Text style={styles.commentContent}>{comment.content}</Text>*/}

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
                        {comment.content}{comment.content}{comment.content}{comment.content}{comment.content}{comment.content}
                        {comment.content}{comment.content}{comment.content}{comment.content}{comment.content}{comment.content}
                        {comment.content}{comment.content}{comment.content}{comment.content}{comment.content}{comment.content}
                    </Text>
                </ViewMoreText>

            </View>
            {isCanDelete && (
                <IconButton style={styles.deleteButton} icon={'delete'} iconColor={PRIMARY.DEFAULT} size={24} onPress={() => removeComment(comment)}/>
                // <TouchableOpacity style={styles.deleteButton} onPress={() => removeComment(comment)}>
                //     <MaterialIcons name='delete' size={24} color={PRIMARY.DEFAULT} />
                // </TouchableOpacity>
            )}
        </View>
    );
});

CommentItem.defaultProps = {
    isCanDelete: false
};

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    isCanDelete: PropTypes.bool,
    removeComment: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    profileImage: {
        marginRight: 10
    },
    commentInfo: {
        flex: 1
    },
    nickName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2
    },
    commentDate: {
        fontSize: 12,
        color: '#000000',
        marginBottom: 4
    },
    commentContent: {
        fontSize: 14,
        flexWrap: 'wrap',
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
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 8
    }
});

export default CommentItem;
