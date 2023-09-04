import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useUserState } from '../../contexts/UserContext';
import { GRAY, PRIMARY, WHITE } from '../../Colors';
import { Button, Divider, Text } from 'react-native-paper';
import * as SecureStore from '../../utils/PreferenceStore';
import { STORE_SETTING_KEYS } from '../../utils/PreferenceStore';
import { useNavigation } from '@react-navigation/native';
import { MainRoutes } from '../../navigations/Routes';
import { readBookmarkRoomList, readMyRoomList } from '../../api/Room';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import { useDialogState } from '../../contexts/DialogContext';
import Constants from 'expo-constants';
import * as Auth from '../../api/Auth';
import Carousel from 'react-native-reanimated-carousel';
import CarouselItem from '../../components/item/CarouselItem';
import { useSharedValue } from 'react-native-reanimated';
import PaginationItem from '../../components/item/PaginationItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AvatarImage from 'react-native-paper/src/components/Avatar/AvatarImage';
import { DIALOG_MODE } from '../../components/message/CustomDialog';

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

    //페이지 index값
    const progressValue = useSharedValue(0);

    const { width, height } = useWindowDimensions();
    const { top, bottom } = useSafeAreaInsets();

    const IMAGE_SIZE = 100;

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
            visible: true,
            mode: DIALOG_MODE.CONFIRM
        });
    };


    return (
        <View style={{
            marginBottom: bottom,
            backgroundColor: PRIMARY.DEFAULT,
            flex: 1
        }}>
            <View style={{
                paddingBottom: 36,
                paddingHorizontal: 36,
                backgroundColor: WHITE,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50
            }}>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 36
                }}>

                </View>
                {
                    user.image ?
                        <AvatarImage source={{ uri: `${BASE_URL_FILE}${user.id}/${user.image}?version=${user.updateDate}` }} size={IMAGE_SIZE}
                                     style={styles.image} />
                        : <AvatarText label={user.nickName.charAt(0)} Text size={100}
                                      style={styles.image} />
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
                    <Button
                        mode='outlined'
                        size={24}
                        containerColor={PRIMARY.DEFAULT}
                        iconColor={PRIMARY.DEFAULT}
                        icon={'account-edit-outline'}
                        onPress={() => {
                            navigation.navigate(MainRoutes.PROFILE_UPDATE);
                        }}
                    >
                        정보 수정
                    </Button>

                    <View style={{marginHorizontal:10}}   />

                    <Button
                        mode='outlined'
                        size={24}
                        iconColor={PRIMARY.DEFAULT}
                        icon={'logout-variant'}
                        onPress={onSignOut}
                    >
                        로그아웃
                    </Button>
                </View>
            </View>


            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 40,
                paddingTop: 20
            }}>

                <Pressable
                    onPress={() => setMyRoomSelected(true)}
                    style={({ pressed }) => [{
                        borderBottomColor: myRoomSelected ? WHITE : PRIMARY.DEFAULT,
                        borderBottomWidth: 4,
                        paddingVertical: 6
                    },
                        { opacity: pressed ? 0.5 : 1 }]}
                >
                    <Text style={{
                        fontWeight: 'bold',
                        color: myRoomSelected ? WHITE : GRAY.LIGHT
                    }}>나의 추모관</Text>
                </Pressable>


                <Pressable
                    onPress={() => setMyRoomSelected(false)}
                    style={({ pressed }) => [{
                        borderBottomColor: myRoomSelected ? PRIMARY.DEFAULT : WHITE,
                        borderBottomWidth: 4,
                        paddingVertical: 6,
                        marginLeft: 30
                    },
                        { opacity: pressed ? 0.5 : 1 }]}
                >
                    <Text style={{
                        fontWeight: 'bold',
                        color: myRoomSelected ? GRAY.LIGHT : WHITE
                    }}>즐겨찾는 추모관</Text>
                </Pressable>
            </View>

            <View style={{flex:1, justifyContent:'center'}}>
                <Carousel
                    onProgressChange={(_, absoluteProgress) =>
                        (progressValue.value = absoluteProgress)
                    }
                    mode={'parallax'}
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 50
                    }}
                    panGestureHandlerProps={{
                        activeOffsetX: [-10, 10]
                    }}
                    loop={true}
                    width={width}
                    height={height * 0.4}
                    data={myRoomSelected ? myRooms : favoriteRooms}
                    renderItem={({ item }) => <CarouselItem room={item} />}>
                </Carousel>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    {
                        (myRoomSelected ? myRooms : favoriteRooms).map((backgroundColor, index) => {
                            return (
                                <PaginationItem
                                    backgroundColor={backgroundColor}
                                    animValue={progressValue}
                                    index={index}
                                    key={index}
                                    isRotate={false}
                                    length={(myRoomSelected ? myRooms : favoriteRooms).length}
                                />
                            );
                        })}

                </View>
            </View>


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
    },
    image: {
        marginVertical: 20,
        alignSelf: 'center'
    }
});

export default MyPageScreen;
