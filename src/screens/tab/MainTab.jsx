import React from 'react';
import {ContentRoutes, MainRoutes} from "../../navigations/Routes";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import TabBarAddButton from "../../components/button/TabBarAddButton";
import BoardScreen from "../main/BoardScreen";
import TestScreen from "../main/TestScreen";
import HomeScreen from "../main/HomeScreen";
import {GRAY, PRIMARY} from "../../Colors";
import {SafeAreaProvider} from "react-native-safe-area-context";
import MyPageScreen from "../main/MyPageScreen";

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
                lazy:false,
                // tabBarShowLabel: false
                lazyPreloadDistance: 4
            }}>
                <Tab.Screen name={ContentRoutes.HOME} component={HomeScreen}
                            options={{
                                tabBarIcon: (props) => getTabBarIcon({...props, name: 'home', color:PRIMARY.DEFAULT}),
                                tabBarLabel: '추모관', tabBarShowLabel:false
                            }}/>
                <Tab.Screen name={ContentRoutes.BOARD} component={BoardScreen}
                            options={{
                                tabBarIcon: (props) => getTabBarIcon({...props, name: 'post', color:PRIMARY.DEFAULT}),
                                tabBarLabel: '게시글', tabBarShowLabel:false
                            }}/>

                <Tab.Screen name={'addButton'} component={AddButtonScreen}
                            options={{tabBarButton: () => <TabBarAddButton/>}}/>

                <Tab.Screen name={ContentRoutes.TEST} component={TestScreen}
                            options={{
                                tabBarIcon: (props) => getTabBarIcon({...props, name: 'clipboard-list', color:PRIMARY.DEFAULT}),
                                tabBarLabel: '자가진단', tabBarShowLabel:false
                            }}/>
                <Tab.Screen name={ContentRoutes.MY_PAGE} component={MyPageScreen}
                            options={{
                                tabBarIcon: (props) => getTabBarIcon({...props, name: 'account', color:PRIMARY.DEFAULT}),
                                tabBarLabel: '마이 페이지', tabBarShowLabel:false
                            }}/>
            </Tab.Navigator>
        </SafeAreaProvider>
    );
};

export default MainTab;
