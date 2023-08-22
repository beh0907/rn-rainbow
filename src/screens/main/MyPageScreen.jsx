import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useUserState } from '../../contexts/UserContext';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from '../../utils/PreferenceStore';
import { STORE_SETTING_KEYS } from '../../utils/PreferenceStore';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import { readBookmarkRoomList, readMyRoomList } from '../../api/Room';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import { useDialogState } from '../../contexts/DialogContext';
import Constants from 'expo-constants';
import * as Auth from '../../api/Auth';

import Carousel from 'react-native-reanimated-carousel';
import CarouselItem2 from '../../components/item/CarouselItem2';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const MyPageScreen = () => {
    const [user, setUser] = useUserState();
    const navigation = useNavigation();

    const [, setDialog] = useDialogState();

    //탭 메뉴
    const [myRoomSelected, setMyRoomSelected] = useState(true);

    //나의 추모관과 즐겨찾기 추모관 목록
    const [myRooms, setMyRooms] = useState([]);
    const [favoriteRooms, setFavoriteRooms] = useState();

    const { width, height } = useWindowDimensions();

    useEffect(() => {
        (async () => {
            const favorites = await SecureStore.getListFor(STORE_SETTING_KEYS.FAVORITE_ROOMS);

            setMyRooms(await readMyRoomList(user.id));
            setFavoriteRooms(await readBookmarkRoomList(favorites));
        })();
    }, []);

    const onSignOut = () => {
        setDialog({
            title: '로그아웃',
            message: '정말로 로그아웃 하시겠습니까?',
            onPress: async () => {
                await Auth.signOut(user);
                await SecureStore.signOutSecureStore();
                setUser({});
            },
            visible: true
        });
    };

    return (
        <View style={{
            backgroundColor: PRIMARY.DEFAULT,
            height: '100%'
        }}>
            <View style={{
                paddingHorizontal: 36,
                backgroundColor: WHITE,
                height: '50%',
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50
            }}>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 36
                }}>
                    <Pressable onPress={() => {
                        navigation.navigate(MainRoutes.PROFILE_UPDATE);
                    }} style={{
                        width: '50%',
                        alignItems: 'flex-start'
                    }}>
                        <MaterialCommunityIcons
                            name='account-edit-outline'
                            size={24}
                            color={PRIMARY.DARK}
                        />
                    </Pressable>

                    <Pressable onPress={onSignOut} style={{
                        width: '50%',
                        alignItems: 'flex-end'
                    }}>
                        <MaterialCommunityIcons
                            name='logout-variant'
                            size={24}
                            color={PRIMARY.DARK}
                        />
                    </Pressable>
                </View>

                {
                    user.image ?
                        <AvatarImage source={{ uri: `${BASE_URL_FILE}${user.id}/profile.jpg` }} size={100}
                                     style={{ marginVertical: 20, alignSelf: 'center' }} />
                        : <AvatarText label={user.nickName.charAt(0)} Text size={100}
                                      style={{ marginVertical: 20, alignSelf: 'center' }} />
                }

                <Text variant={'titleLarge'} style={{
                    color: PRIMARY.DEFAULT,
                    fontWeight: 'bold',
                    alignSelf: 'center'
                }}>
                    {user.nickName}
                </Text>
                <Text variant={'titleMedium'} style={styles.grayText}>
                    {user.mail}
                </Text>

                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: 20
                }}>
                    <View>
                        <Text variant={'bodyLarge'} style={styles.boldDarkText}>280</Text>

                        <Text variant={'titleMedium'} style={styles.grayText}>
                            photos
                        </Text>
                    </View>

                    <View style={{ marginHorizontal: 40 }}>
                        <Text variant={'bodyLarge'} style={styles.boldDarkText}>2,107</Text>

                        <Text variant={'titleMedium'} style={styles.grayText}>
                            followers
                        </Text>
                    </View>


                    <View>
                        <Text variant={'bodyLarge'} style={styles.boldDarkText}>104</Text>

                        <Text variant={'titleMedium'} style={styles.grayText}>
                            follows
                        </Text>
                    </View>
                </View>
            </View>


            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 40,
                paddingTop: 20
            }}>

                <TouchableOpacity
                    onPress={() => setMyRoomSelected(true)}
                    style={{
                        borderBottomColor: myRoomSelected ? WHITE : PRIMARY.DEFAULT,
                        borderBottomWidth: 4,
                        paddingVertical: 6
                    }}
                >
                    <Text style={{
                        fontWeight: 'bold',
                        color: myRoomSelected ? WHITE : GRAY.DEFAULT
                    }}>나의 추모관</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setMyRoomSelected(false)}
                    style={{
                        borderBottomColor: myRoomSelected ? PRIMARY.DEFAULT : WHITE,
                        borderBottomWidth: 4,
                        paddingVertical: 6,
                        marginLeft: 30
                    }}>
                    <Text style={{
                        fontWeight: 'bold',
                        color: myRoomSelected ? GRAY.DEFAULT : WHITE
                    }}>즐겨찾는 추모관</Text>
                </TouchableOpacity>
            </View>

            {/*<FlatList*/}
            {/*    showsHorizontalScrollIndicator={false}*/}
            {/*    horizontal*/}
            {/*    style={styles.container}*/}
            {/*    data={myRoomSelected ? myRooms : favoriteRooms} // 탭 메뉴 상태에 따라 수정*/}
            {/*    renderItem={({item}) => <HorizontalRoomItem room={item}/>}*/}
            {/*    keyExtractor={(item, index) => index}*/}
            {/*    ItemSeparatorComponent={() => <View style={styles.separator}></View>}*/}
            {/*/>*/}

            <Carousel
                panGestureHandlerProps={{
                    activeOffsetX: [-10, 10]
                }}
                loop={true}
                width={width * 0.8}
                height={height * 0.3}
                style={{ width: '100%', alignSelf: 'center' }}
                data={myRoomSelected ? myRooms : favoriteRooms}
                renderItem={({ item }) => {
                    console.log('아이템', item);
                    return <CarouselItem2 item={item} />;
                }} />

            {/*<ImageCarousel rooms={myRoomSelected ? myRooms : favoriteRooms} />*/}
        </View>
    );
};

const styles = StyleSheet.create({
    boldText: {
        fontWeight: 'bold',
        color: WHITE
    },
    boldDarkText: {
        fontWeight: 'bold',
        color: PRIMARY.DARK,
        alignSelf: 'center'
    },
    grayText: {
        color: GRAY.DEFAULT,
        alignSelf: 'center'
    },
    containerList: {
        marginHorizontal: 40,
        borderRadius: 30,
        marginTop: 30
    }
});

export default MyPageScreen;
