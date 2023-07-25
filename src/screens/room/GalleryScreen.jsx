import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import {readRoom} from "../../api/Room";
import {readCommentList} from "../../api/Comment";
import {readMemoryList} from "../../api/Memory";
import {readGalleryList} from "../../api/Gallery";
import {useRoute} from "@react-navigation/native";

const GalleryScreen = () => {
    const {param} = useRoute()

    const [galleries,setGalleries] = useState([])

    useEffect(() => {
        (async () => {
            setGalleries(await readGalleryList(param.roomNum))
            console.log("갤러리", galleries)
        })();
    }, [])

    return (
        <View style={[styles.container]}>
            <Text>메모리</Text>
        </View>
    );
};

GalleryScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default GalleryScreen;
