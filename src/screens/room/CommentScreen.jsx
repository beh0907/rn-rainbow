import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import {readRoom} from "../../api/Room";
import {readCommentList} from "../../api/Comment";
import {readMemoryList} from "../../api/Memory";
import {readGalleryList} from "../../api/Gallery";

const CommentScreen = ({route}) => {
    const {top, bottom} = useSafeAreaInsets();
    const {roomNum} = route.params;

    const [comments,setComments] = useState({})

    useEffect(() => {
        (async () => {
            setComments(await readCommentList(roomNum))
        })();
    }, [])

    return (
        <View style={[styles.container, {marginTop: top}]}>
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
