import React from 'react';
import {Pressable, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {BLACK} from "../../Colors";

const HeaderLeft = () => {
    const navigation = useNavigation()

    return (
        <Pressable onPress={() => navigation.canGoBack() && navigation.goBack()} hitSlop={10}>
            <MaterialCommunityIcons name={'chevron-left'} size={24} color={BLACK}/>
        </Pressable>
    );
};

export default HeaderLeft;
