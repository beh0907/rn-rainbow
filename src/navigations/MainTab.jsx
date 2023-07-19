import React from 'react';
import {ContentRoutes} from "./Routes";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import TabBarAddButton from "../components/button/TabBarAddButton";
import BoardScreen from "../screens/main/BoardScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import TestScreen from "../screens/main/TestScreen";
import HomeScreen from "../screens/main/HomeScreen";
import {GRAY, PRIMARY} from "../Colors";
import {SafeAreaProvider} from "react-native-safe-area-context";

const Tab = createBottomTabNavigator()

const getTabBarIcon = ({focused, color, size, name}) => {
    const iconName = focused ? name : `${name}-outline`
    return <MaterialCommunityIcons name={iconName} size={size} color={color}/>
}

const AddButtonScreen = () => null

const MainTab = () => {
    return (
        <SafeAreaProvider>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: PRIMARY.DARK,
                tabBarInactiveTintColor: GRAY.DARK,
                tabBarShowLabel: false
            }}>
                <Tab.Screen name={ContentRoutes.HOME} component={HomeScreen}
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
                                tabBarIcon: (props) => getTabBarIcon({...props, name: 'clipboard-list'}),
                                tabBarLabel: '자가진단'
                            }}/>
                <Tab.Screen name={ContentRoutes.PROFILE} component={ProfileScreen}
                            options={{
                                tabBarIcon: (props) => getTabBarIcon({...props, name: 'account'}),
                                tabBarLabel: '프로필'
                            }}/>
            </Tab.Navigator>
        </SafeAreaProvider>
    );
};

export default MainTab;
