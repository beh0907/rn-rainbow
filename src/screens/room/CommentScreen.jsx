import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {readCommentList} from "../../api/Comment";

const CommentScreen = ({route}) => {
    const {roomNum} = route.params;

    const [comments, setComments] = useState({})

    useEffect(() => {
        (async () => {
            setComments(await readCommentList(roomNum))
            console.log("커멘트", comments)
        })();
    }, [])

    return (
        <View style={[styles.container]}>
            <Text>메모리</Text>
        </View>
    );
};

CommentScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default CommentScreen;
