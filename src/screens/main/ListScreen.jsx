import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import SafeInputView from "../../components/view/SafeInputView";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {SegmentedButtons} from "react-native-paper";
import {PRIMARY, WHITE} from "../../Colors";
import {useUserState} from "../../contexts/UserContext";
import RoomList from "../../components/list/RoomList";
import {useMessageState} from "../../contexts/MessageContext";

const ListScreen = props => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const [user,] = useUserState()
    const [message, setMessage] = useMessageState()

    const [searchQuery, setSearchQuery] = useState(''); //검색 값
    const [roomButtonValue, setRoomButtonValue] = useState('AllRoom'); // 버튼 선택 값
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
            setMessage({
                ...message,
                snackMessage: "한번 더 뒤로가기를 누르시면 앱이 종료됩니다.",
                snackVisible: true
            })

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
        <SafeInputView>
            <StatusBar style={"light"}/>
            <View style={[styles.container, {marginTop: top}]}>
                {/*<Searchbar*/}
                {/*    placeholder="추모관을 검색해주세요."*/}
                {/*    onChangeText={onChangeSearch}*/}
                {/*    value={searchQuery}*/}
                {/*/>*/}

                <SegmentedButtons
                    value={roomButtonValue}
                    onValueChange={setRoomButtonValue}
                    buttons={[
                        {
                            style: {backgroundColor: roomButtonValue === 'AllRoom' ? PRIMARY.LIGHT : WHITE},
                            checkedColor: WHITE,
                            value: 'AllRoom',
                            label: '전체 추모관',
                        },
                        {
                            style: {backgroundColor: roomButtonValue === 'MyRoom' ? PRIMARY.LIGHT : WHITE},
                            checkedColor: WHITE,
                            value: 'MyRoom',
                            label: '나의 추모관',
                        },
                        {
                            style: {backgroundColor: roomButtonValue === 'FavoriteRoom' ? PRIMARY.LIGHT : WHITE},
                            checkedColor: WHITE,
                            value: 'FavoriteRoom',
                            label: '즐겨찾기'
                        },
                    ]}
                />

                <RoomList value={roomButtonValue}/>

            </View>
        </SafeInputView>
    );
};

ListScreen.propTypes = {};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
    }
})

export default ListScreen;
