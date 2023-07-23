import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RoomRoutes} from "../../navigations/Routes";
import CommentScreen from "../room/CommentScreen";
import RoomScreen from "../room/RoomScreen";
import GalleryScreen from "../room/GalleryScreen";
import MemoryScreen from "../room/MemoryScreen";
import {PRIMARY} from "../../Colors";
import React, {useLayoutEffect} from "react";
import {useNavigation} from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

const RoomTab = ({route}) => {
    const navigation = useNavigation();
    const {roomNum} = route.params;

    //우측 상단 버튼
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Room No." + String(roomNum).padStart(4, '0'),
            headerShadowVisible: false,
            headerTitleAlign: 'center'
        });
    }, [navigation, roomNum]);

    return (
        <Tab.Navigator screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: PRIMARY.DEFAULT}
        }}>
            <Tab.Screen name={RoomRoutes.HOME} component={RoomScreen} initialParams={{roomNum}}/>
            <Tab.Screen name={RoomRoutes.GALLERY} component={GalleryScreen} initialParams={{roomNum}}/>
            <Tab.Screen name={RoomRoutes.MEMORY} component={MemoryScreen} initialParams={{roomNum}}/>
            <Tab.Screen name={RoomRoutes.COMMENT} component={CommentScreen} initialParams={{roomNum}}/>
        </Tab.Navigator>
    );
}

export default RoomTab;
