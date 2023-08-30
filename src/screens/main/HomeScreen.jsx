import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { BackHandler, Keyboard, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Menu, Text } from 'react-native-paper';
import { useUserState } from '../../contexts/UserContext';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { BLACK, WHITE } from '../../Colors';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import InputTextButton from '../../components/view/inputTextButton';
import Constants from 'expo-constants';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import ListRoomItem from '../../components/item/ListRoomItem';
import { FlashList } from '@shopify/flash-list';
import * as Room from '../../api/Room';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const HomeScreen = () => {
    const { top, bottom } = useSafeAreaInsets();

    const [user] = useUserState();
    const [, setSnackbar] = useSnackBarState();

    const [searchQuery, setSearchQuery] = useState(''); //검색 값
    const [menuVisible, setMenuVisible] = useState(false);

    const [rooms, setRooms] = useState([]);
    const [sortTitle, setSortTitle] = useState('최신 순');
    const [refetching, setRefetching] = useState(false);

    const isFetch = useRef(true);
    const listRef = useRef(null);
    const pageRef = useRef(1);
    const amountRef = useRef(20);
    const searchRef = useRef('');
    const sortTypeRef = useRef('latest');

    let exitApp;
    /**백 버튼 이벤트 동작*/
    const handleBackButton = () => {
        // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
        if (exitApp === undefined || !exitApp) {
            //스낵바 출력 셋팅
            setSnackbar({
                message: '한번 더 뒤로가기를 누르시면 앱이 종료됩니다.',
                visible: true
            });

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
    };

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
            };
        }, [])
    );

    useLayoutEffect(() => {
        (async () => {
            await refetch();
            // setIsLoading(false)
        })();
    }, []);

    const fetchNextPage = useCallback(async (isRefetch) => {
        if (isFetch.current) {
            //페이지와 개수 정보를 파라미터로 입력한다
            const list = await Room.readRoomList({
                page: pageRef.current,
                amount: amountRef.current,
                type: sortTypeRef.current,
                keyword: searchRef.current
            });

            //페이지당 amount만큼 가져오지만 amount와 개수가 다를 경우 마지막 페이지임을 인식
            if (list.length !== amountRef.current) {
                isFetch.current = false;
            }

            //새로 가져온 추모관이 하나라도 있다면 리스트에 추가한다
            // if (list.length > 0) {

            // 새로고침이라면 새로
            if (isRefetch === true) setRooms(list);
            else setRooms(prev => [...prev, ...list]);

            pageRef.current++;
            // }
        }
    }, [isFetch, pageRef, rooms, amountRef, sortTypeRef, searchRef]);

    const refetch = useCallback(async () => {
        setRefetching(true);

        pageRef.current = 1;
        isFetch.current = true;

        await fetchNextPage(true);

        if (rooms.length !== 0)
            listRef.current.scrollToOffset({ animated: true, offset: 0 });

        setRefetching(false);
    }, [pageRef, isFetch, fetchNextPage, refetching, rooms]);

    // 검색어 활용 추모관 목록 검색
    const onSearch = useCallback(async () => {
        Keyboard.dismiss();

        searchRef.current = searchQuery;
        await refetch();
    }, [searchRef, searchQuery, refetch, rooms]);

    const selectSortMenu = useCallback(async (type, title) => {
        setMenuVisible(false);

        setSortTitle(title);
        sortTypeRef.current = type;

        await refetch();
    }, [menuVisible, sortTitle, sortTypeRef, refetch, rooms]);

    return (
        <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
            <View style={styles.containerUser}>

                {
                    user.image ?
                        <AvatarImage
                            source={{ uri: `${BASE_URL_FILE}${user.id}/${user.image}?version=${user.updateDate}` }}
                            size={48} />
                        : <AvatarText label={user.nickName.charAt(0)} Text size={48} />
                }


                <View style={{ marginStart: 16 }}>
                    <Text variant={'titleLarge'} style={{ fontWeight: 'bold' }}>{user.nickName}</Text>
                    {/*<Text variant={"titleSmall"} style={{color: GRAY.DARK}}>{user.mail}</Text>*/}
                </View>
            </View>

            <InputTextButton
                styles={{
                    input: {
                        marginHorizontal: 16
                    }
                }}
                value={searchQuery} onChangeText={setSearchQuery}
                icon={'search'}
                // disabled={searchQuery === ''}
                placeholder={'검색어를 입력해주세요.'}
                onSubmit={onSearch} />

            <View style={{
                flexDirection: 'row',
                marginTop: 20,
                marginBottom: 10,
                alignItems: 'center',
                paddingHorizontal: 16,
                justifyContent: 'space-between'
            }}>
                <Text variant='titleLarge' style={{ color: BLACK, flex: 1 }}>전체 추모관</Text>

                <Menu
                    theme={{ colors: { primary: 'green' } }}
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={<Button contentStyle={{ flexDirection: 'row-reverse' }} icon={'menu-down'}
                                    onPress={() => setMenuVisible(true)}>{sortTitle}</Button>}>
                    <Menu.Item onPress={() => selectSortMenu('latest', '최신 순')} title='최신 순' />
                    <Menu.Item onPress={() => selectSortMenu('oldest', '오래된 순')} title='오래된 순' />
                    <Menu.Item onPress={() => selectSortMenu('popular', '조회 순')} title='조회 순' />
                </Menu>
            </View>

            {
                rooms.length === 0
                    ?
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text>검색된 정보가 없습니다.</Text>
                    </View>
                    :
                    <FlashList
                        ref={listRef}
                        estimatedItemSize={124}
                        showsVerticalScrollIndicator={false}
                        data={rooms}
                        renderItem={({ item }) => <ListRoomItem room={item} />}
                        contentContainerStyle={styles.containerList}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        onEndReachedThreshold={0.9}
                        onEndReached={() => fetchNextPage(false)}
                        refreshing={refetching}
                        onRefresh={refetch}
                        ListFooterComponent={refetching && <Text>목록을 불러오고 있습니다.</Text>}
                        ListFooterComponentStyle={styles.listFooter}
                    />
            }
        </View>
    );
};

HomeScreen.propTypes = {};


const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        flex: 1,
        height: '100%'
    },
    containerUser: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerList: {
        paddingVertical: 10
    },
    separator: {
        marginVertical: 5
    },
    listFooter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default HomeScreen;
