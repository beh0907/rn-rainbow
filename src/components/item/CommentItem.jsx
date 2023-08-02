import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY } from '../../Colors';

const CommentItem = memo(({ comment, isMine, removeComment }) => {
    return (
        <View style={styles.container}>
            {/*<Image*/}
            {/*    source={require('../../../assets/icon/ic_dog.png')} // 프로필 이미지 주소*/}
            {/*    style={styles.profileImage}*/}
            {/*/>*/}
            <AvatarText style={styles.profileImage} label={comment.nickName.charAt(0)} Text size={36} />
            <View style={styles.commentInfo}>
                <Text style={styles.nickName}>{comment.nickName}</Text>
                <Text style={styles.commentDate}>{comment.date}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
            {isMine && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeComment(comment)}>
                    <MaterialCommunityIcons name="delete" size={24} color={PRIMARY.DEFAULT} />
                </TouchableOpacity>
            )}
        </View>
    );
});

CommentItem.defaultProps = {
    isMine: false
};

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    isMine: PropTypes.bool,
    removeComment: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    profileImage: {
        marginRight: 10
    },
    commentInfo: {
        // flex: 1
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
        fontSize: 14
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 8,
    },
});

export default CommentItem;
