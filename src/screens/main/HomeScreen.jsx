import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, Pressable, ScrollView, StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Text} from "react-native-paper";
import {useUserState} from "../../contexts/UserContext";
import RoomList from "../../components/list/RoomList";
import {useMessageState} from "../../contexts/MessageContext";
import MyRoomList from "../../components/list/MyRoomList";
import FavoriteRoomList from "../../components/list/FavoriteRoomList";
import {BLACK, GRAY, PRIMARY} from "../../Colors";
import AvatarText from "react-native-paper/src/components/Avatar/AvatarText";

const HomeScreen = props => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const [user,] = useUserState()
    const [, setMessage] = useMessageState()

    const [searchQuery, setSearchQuery] = useState(''); //검색 값
    const onChangeSearch = query => setSearchQuery(query);

    let exitApp;

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

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            };
        }, [])
    );

    return (
        <ScrollView>
            <StatusBar style={"dark"}/>
            <View style={[styles.container, {marginTop: top}]}>
                {/*<Searchbar*/}
                {/*    placeholder="추모관을 검색해주세요."*/}
                {/*    onChangeText={onChangeSearch}*/}
                {/*    value={searchQuery}*/}
                {/*/>*/}

                <View style={styles.containerUser}>
                    <AvatarText style={{marginBottom: 16}} label={user.nickName.charAt(0)} Text size={64}/>
                    <Text variant={"titleLarge"} style={{fontWeight: "bold"}}>{user.nickName}</Text>
                    <Text variant={"titleSmall"} style={{color: GRAY.DARK}}>{user.mail}</Text>
                </View>

                {/*<View style={styles.containerList}>*/}
                {/*    <Text variant="headlineMedium" style={{color: BLACK}}>추모관</Text>*/}
                {/*</View>*/}

                <View style={styles.containerList}>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text variant="titleMedium" style={{color: BLACK}}>전체 추모관</Text>


                        <Pressable hitSlop={15}>
                            <Text variant="titleSmall" style={{color: PRIMARY.DEFAULT}}>상세 보기</Text>
                        </Pressable>
                    </View>
                    <RoomList isHorizontal={true}/>
                </View>

                <View style={styles.containerList}>
                    <Text variant="titleMedium" style={{color: BLACK}}>나의 추모관</Text>
                    <MyRoomList isHorizontal={true}/>
                </View>

                <View style={styles.containerList}>
                    <Text variant="titleMedium" style={{color: BLACK}}>즐겨찾기 추모관</Text>
                    <FavoriteRoomList isHorizontal={true}/>
                </View>
            </View>
        </ScrollView>
    );
};

HomeScreen.propTypes = {};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    containerUser: {
        paddingVertical: 36,
        alignItems: "center"
    },
    containerList: {
        elevation: 2, // 그림자 효과를 주기 위해 elevation 값 추가
        backgroundColor: 'white', // 카드뷰 배경색을 흰색으로 설정
        borderRadius: 8, // 카드뷰에 둥근 모서리를 주기 위해 borderRadius 값 추가
        marginBottom: 16, // 아이템들 사이의 간격을 주기 위해 marginBottom 값 추가
        padding: 16, // 카드뷰 내부의 컨텐츠에 패딩을 추가
    },
})

export default HomeScreen;
