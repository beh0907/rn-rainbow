import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RoomRoutes} from "../../navigations/Routes";
import CommentScreen from "../room/CommentScreen";
import RoomScreen from "../room/RoomScreen";
import GalleryScreen from "../room/GalleryScreen";
import MemoryScreen from "../room/MemoryScreen";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

const RoomTab = ({route}) => {
    const {top} = useSafeAreaInsets();
    const {roomNum} = route.params;

    return (
        <Tab.Navigator style={{marginTop: top}}>
            <Tab.Screen name={RoomRoutes.HOME} component={RoomScreen} initialParams={{roomNum}}/>
            <Tab.Screen name={RoomRoutes.GALLERY} component={GalleryScreen} initialParams={{roomNum}}/>
            <Tab.Screen name={RoomRoutes.MEMORY} component={MemoryScreen} initialParams={{roomNum}}/>
            <Tab.Screen name={RoomRoutes.COMMENT} component={CommentScreen} initialParams={{roomNum}}/>
        </Tab.Navigator>
    );
}

export default RoomTab;
