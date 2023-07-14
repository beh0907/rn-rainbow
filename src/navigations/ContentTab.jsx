import React from 'react';
import {AuthRoutes, ContentRoutes} from "./Routes";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import TabBarAddButton from "../components/button/TabBarAddButton";
import BoardScreen from "../screens/main/BoardScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import TestScreen from "../screens/main/TestScreen";
import ListScreen from "../screens/main/ListScreen";
import {GRAY, PRIMARY} from "../Colors";

const Tab = createBottomTabNavigator()

const getTabBarIcon = ({focused, color, size, name}) => {
    const iconName = focused ? name : `${name}-outline`
    return <MaterialCommunityIcons name={iconName} size={size} color={color}/>
}

const AddButtonScreen = () => null

const ContentTab = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: PRIMARY.DARK,
            tabBarInactiveTintColor: GRAY.DARK,
            // tabBarShowLabel: false
        }}>
            <Tab.Screen name={ContentRoutes.LIST} component={ListScreen}
                        options={{
                            tabBarIcon: (props) => getTabBarIcon({...props, name: 'home'}),
                            tabBarLabel: '추모관'
                        }}/>
            <Tab.Screen name={ContentRoutes.BOARD} component={BoardScreen}
                        options={{
                            tabBarIcon: (props) => getTabBarIcon({...props, name: 'post'}),
                            tabBarLabel: '게시글'
                        }}/>

            <Tab.Screen name={'AddButton'} component={AddButtonScreen}
                        options={{tabBarButton: () => <TabBarAddButton/>}}/>

            <Tab.Screen name={ContentRoutes.TEST} component={TestScreen}
                        options={{
                            tabBarIcon: (props) => getTabBarIcon({...props, name: 'map'}),
                            tabBarLabel: '자가진단'
                        }}/>
            <Tab.Screen name={ContentRoutes.PROFILE} component={ProfileScreen}
                        options={{
                            tabBarIcon: (props) => getTabBarIcon({...props, name: 'account'}),
                            tabBarLabel: '프로필'
                        }}/>
        </Tab.Navigator>
    );
};

export default ContentTab;
