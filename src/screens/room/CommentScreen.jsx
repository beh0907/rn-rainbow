import React, {useEffect, useState} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {Text} from "react-native-paper";
import {readCommentList} from "../../api/Comment";
import { useUserState } from '../../contexts/UserContext';
import { useRoomState } from '../../contexts/RoomContext';

const CommentScreen = () => {
    const [user,] = useUserState()
    const [room, ] = useRoomState();
    const [comments, setComments] = useState({})

    useEffect(() => {
        (async () => {
            setComments(await readCommentList(room.roomNum))
        })();
    }, [])

    return (
        <View style={[styles.container]}>
            <FlatList
                keyExtractor={(item) => item.seq}
                data={comments} renderItem={({item}) =><Text>{item.content}</Text>}/>
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
    }
})

export default CommentScreen;
