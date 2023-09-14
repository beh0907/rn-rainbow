import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../../Colors';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import Constants from 'expo-constants';
import ViewMoreText from 'react-native-view-more-text';
import { IconButton } from 'react-native-paper';
import { calculateTimeDifference } from '../../utils/DateUtil';
import { RoomRoutes } from '../../navigations/Routes';
import { useNavigation } from '@react-navigation/native';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const CommentItem = memo(({ comment, isCanDelete, removeComment }) => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            {
                comment.image ?
                    <Pressable onPress={() => navigation.navigate(RoomRoutes.IMAGE_CONTROL, {url : `${BASE_URL_FILE}${comment.userId}/${comment.image}?version=${comment.userUpdateDate}`})}>
                        <AvatarImage
                            source={{ uri: `${BASE_URL_FILE}${comment.userId}/${comment.image}?version=${comment.userUpdateDate}` }}
                            size={48}
                            style={styles.profileImage} />
                    </Pressable>
                    : <AvatarText label={comment.nickName.charAt(0)} Text size={48}
                                  style={styles.profileImage} />
            }

            <View style={styles.commentInfo}>
                <View style={{ flexDirection: 'rowarn', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.nickName} numberOfLines={1}>{comment.nickName}</Text>
                        <Text style={styles.commentDate}>{calculateTimeDifference(comment.date)}</Text>
                        {/*<Text style={styles.commentContent}>{comment.content}</Text>*/}
                    </View>

                    {isCanDelete && (
                        <IconButton mode={'outlined'} icon={'delete'} iconColor={PRIMARY.DEFAULT}
                                    size={24} onPress={() => removeComment(comment)} />
                    )}
                </View>


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
                        {comment.content}
                    </Text>
                </ViewMoreText>

            </View>
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
    containerCollapse: {
        flexDirection: 'row',
        marginTop: 10,
        alignSelf: 'flex-start'
    },
    commentCollapse: {
        color: GRAY.DEFAULT
    }
});

export default CommentItem;
