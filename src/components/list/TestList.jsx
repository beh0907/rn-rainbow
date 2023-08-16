import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import VerticalCardRoomItem from "../item/VerticalCardRoomItem";
import useRooms from "../../hooks/UseRooms";
import { Text } from 'react-native-paper';

const TestList = () => {
    return (
        <View>
            <Text>dasdsa</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        marginTop: 10,
    },
    separator: {
        marginVertical: 10,
    }
})

export default TestList;
