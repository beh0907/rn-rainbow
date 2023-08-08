import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY } from '../../Colors';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import { BASE_URL_FILE } from '@env';

const CommentItem = memo(({ comment, isCanDelete, removeComment }) => {
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
                <Text style={styles.commentDate}>{comment.date}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
            {isCanDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeComment(comment)}>
                    <MaterialCommunityIcons name='delete' size={24} color={PRIMARY.DEFAULT} />
                </TouchableOpacity>
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
        flexWrap: 'wrap'
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 8
    }
});

export default CommentItem;
