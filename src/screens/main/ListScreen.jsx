import React, {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Text} from "react-native-paper";
import {useUserState} from "../../contexts/UserContext";
import RoomList from "../../components/list/RoomList";
import {useMessageState} from "../../contexts/MessageContext";
import MyRoomList from "../../components/list/MyRoomList";
import FavoriteRoomList from "../../components/list/FavoriteRoomList";
import SafeInputView from "../../components/view/SafeInputView";

const ListScreen = props => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const [user,] = useUserState()
    const [, setMessage] = useMessageState()

    const [searchQuery, setSearchQuery] = useState(''); //검색 값
    const onChangeSearch = query => setSearchQuery(query);

    let exitApp;
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton); //뒤로가기 함수를 해제하는 이벤트 등록
        };
    }, [])

    // 이벤트 동작
    const handleBackButton = () => {
        // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
        if (exitApp === undefined || !exitApp) {
            //스낵바 출력 셋팅
            setMessage(prev => ({
                ...prev,
                snackMessage: "한번 더 뒤로가기를 누르시면 앱이 종료됩니다.",
                snackVisible: true
            }))

            exitApp = true;

            this.timeout = setTimeout(
                () => {
                    exitApp = false;
                },
                2000    // 2초
            );
        } else {
            clearTimeout(this.timeout);

            BackHandler.exitApp();  // 앱 종료
        }
        return true;
    }

    return (
        <ScrollView>
            <StatusBar style={"dark"}/>
            <View style={[styles.container, {marginTop: top}]}>
                {/*<Searchbar*/}
                {/*    placeholder="추모관을 검색해주세요."*/}
                {/*    onChangeText={onChangeSearch}*/}
                {/*    value={searchQuery}*/}
                {/*/>*/}

                <View style={styles.containerList}>
                    <Text variant="headlineMedium">추모관</Text>
                </View>

                <View style={styles.containerList}>
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text variant="titleMedium">전체 추모관</Text>
                        <Text variant="titleSmall">상세 보기 ></Text>
                    </View>
                    <RoomList isHorizontal={true}/>
                </View>

                <View style={styles.containerList}>
                    <Text variant="titleMedium">나의 추모관</Text>
                    <MyRoomList isHorizontal={true}/>
                </View>

                <View style={styles.containerList}>
                    <Text variant="titleMedium">즐겨찾기 추모관</Text>
                    <FavoriteRoomList isHorizontal={true}/>
                </View>
            </View>
        </ScrollView>
    );
};

ListScreen.propTypes = {};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    containerList: {
        marginTop: 32
    }
})

export default ListScreen;
