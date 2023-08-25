import React, { useCallback, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, ToggleButton } from 'react-native-paper';
import { useUserState } from '../../contexts/UserContext';
import AllRoomList from '../../components/list/AllRoomList';
import { useSnackBarState } from '../../contexts/SnackBarContext';
import { BLACK, PRIMARY, WHITE } from '../../Colors';
import AvatarText from 'react-native-paper/src/components/Avatar/AvatarText';
import InputTextButton from '../../components/view/inputTextButton';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

const { BASE_URL_FILE } = Constants.expoConfig.extra;

const HomeScreen = props => {
    const { top, bottom } = useSafeAreaInsets();

    const [user] = useUserState();
    const [, setSnackbar] = useSnackBarState();

    const [searchQuery, setSearchQuery] = useState(''); //검색 값


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

    return (
        <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
            <View style={styles.containerUser}>

                {
                    user.image ?
                        <Image style={{ width: 48, height: 48, borderRadius: 24 }} cachePolicy={'none'}
                               source={{ uri: `${BASE_URL_FILE}${user.id}/profile.jpg` }} />
                        // <AvatarImage source={{ uri: `${BASE_URL_FILE}${user.id}/profile.jpg` }} size={48} />
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
                disabled={searchQuery === ''}
                placeholder={'검색어를 입력해주세요.'}
                onSubmit={() => {
                }} />

            <View style={{
                flexDirection: 'row', marginTop: 20, marginBottom: 10, alignItems: 'center', paddingHorizontal: 16
            }}>
                <Text variant='titleLarge' style={{ color: BLACK, flex: 1 }}>전체 추모관</Text>
            </View>

            <AllRoomList />
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
    containerMenu: {
        elevation: 2, // 그림자 효과를 주기 위해 elevation 값 추가
        backgroundColor: 'white', // 카드뷰 배경색을 흰색으로 설정
        borderRadius: 8, // 카드뷰에 둥근 모서리를 주기 위해 borderRadius 값 추가
        marginBottom: 16, // 아이템들 사이의 간격을 주기 위해 marginBottom 값 추가
        padding: 16 // 카드뷰 내부의 컨텐츠에 패딩을 추가
    }
});

export default HomeScreen;
