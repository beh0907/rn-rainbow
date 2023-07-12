import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import SafeInputView from "../components/SafeInputView";
import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {SegmentedButtons} from "react-native-paper";
import {PRIMARY, WHITE} from "../Colors";
import RoomItem from "../components/RoomItem";
import {readList} from "../api/Room";
import {useUserState} from "../contexts/UserContext";
import RoomList from "../components/RoomList";

const ListScreen = props => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const [user,] = useUserState()

    const [listRoom, setListRoom] = useState([])
    const [listMyRoom, setListMyRoom] = useState([])
    const [listFavoriteRoom, setListFavoriteRoom] = useState([])

    const [searchQuery, setSearchQuery] = useState(''); //검색 값
    const [roomButtonValue, setRoomButtonValue] = useState('AllRoom'); // 버튼 선택 값
    const onChangeSearch = query => setSearchQuery(query);

    return (
        <SafeInputView>
            <StatusBar style={"light"}/>
            <View style={[styles.container, {paddingTop: top}]}>
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

                <RoomList/>

            </View>
        </SafeInputView>
    );
};

ListScreen.propTypes = {};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16
    }
})

export default ListScreen;
