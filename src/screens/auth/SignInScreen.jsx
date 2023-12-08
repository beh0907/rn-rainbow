import React, { useCallback, useReducer, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Keyboard, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { AuthRoutes } from '../../navigations/Routes';
import { ReturnKeyTypes } from '../../components/view/Input';
import Button from '../../components/button/Button';
import TextButton from '../../components/button/TextButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeInputView from '../../components/view/SafeInputView';
import { PRIMARY, WHITE } from '../../Colors';
import { authFormReducer, AuthFormTypes, initAuthForm } from '../../reducer/AuthFormReducer';
import { useUserState } from '../../contexts/UserContext';
import * as Auth from '../../api/Auth';
import * as SecureStore from '../../utils/PreferenceStore';
import { STORE_USER_KEYS } from '../../utils/PreferenceStore';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Text, TextInput } from 'react-native-paper';
import * as KakaoLogins from '@react-native-seoul/kakao-login';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useDialogState } from '../../contexts/DialogContext';
import { DIALOG_MODE } from '../../components/message/CustomDialog';

const SignInScreen = () => {
    const navigation = useNavigation();
    const { top, bottom } = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const passwordRef = useRef();
    const [, setDialog] = useDialogState();

    const [form, dispatch] = useReducer(authFormReducer, initAuthForm);
    const [, setUser] = useUserState();
    const [isAutoLogin, setAutoLogin] = useState(false);
    const [isHidePassword, setHidePassword] = useState(true);

    const onSignIn = async () => {
        Keyboard.dismiss();

        if (!form.disabled && !form.isLoading) {
            dispatch({ type: AuthFormTypes.TOGGLE_LOADING });

            try {
                const fcmToken = (await Notifications.getDevicePushTokenAsync({
                    projectId: Constants.expoConfig.extra.eas.projectId
                })).data;

                const expoToken = (await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig.extra.eas.projectId
                })).data;

                // const user = await Auth.signIn(form, fcmToken);
                const user = await Auth.signIn(form, expoToken);


                /**자동 로그인이 체크되어 있다면
                 로그인 정보를 저장한다*/
                if (isAutoLogin) {
                    await SecureStore.signInSecureStore({
                        [STORE_USER_KEYS.ID]: user.id,
                        [STORE_USER_KEYS.PASSWORD]: form.password,
                        [STORE_USER_KEYS.PROVIDER]: 'NATIVE',
                        [STORE_USER_KEYS.ACCESS_TOKEN]: '',
                        [STORE_USER_KEYS.REFRESH_TOKEN]: ''
                    });
                } else {
                    await SecureStore.signOutSecureStore();
                }

                setUser(user);
            } catch (e) {
                setDialog({
                    title: '로그인 실패',
                    message: '오류 발생',
                    onPress: async () => {
                        dispatch({ type: AuthFormTypes.TOGGLE_LOADING });
                    },
                    visible: true,
                    mode: DIALOG_MODE.ALERT
                });
            }
        }
    };

    const onSignInKaKao = async () => {
        //로그인하기
        const token = await KakaoLogins.login();
        //프로필 가져오기
        const profile = await KakaoLogins.getProfile();

        console.log('토큰 : ', token);
        console.log('프로필 : ', profile);

        const fcmToken = (await Notifications.getDevicePushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
        })).data;

        const expoToken = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
        })).data;

        // const user = await Auth.signInKaKao(profile, fcmToken);
        const user = await Auth.signInKaKao(profile, expoToken);

        await SecureStore.signInSecureStore({
            [STORE_USER_KEYS.ID]: profile.id,
            [STORE_USER_KEYS.PASSWORD]: '',
            [STORE_USER_KEYS.PROVIDER]: 'KAKAO',
            [STORE_USER_KEYS.ACCESS_TOKEN]: '',
            [STORE_USER_KEYS.REFRESH_TOKEN]: ''
        });

        setUser(user);
    };

    const updateForm = payload => {
        const newForm = { ...form, ...payload };
        const disabled = !newForm.id || !newForm.password;

        dispatch({
            type: AuthFormTypes.UPDATE_FORM,
            payload: { disabled, ...payload }
        });
    };

    //다른 화면에서 로그인 화면으로 포커스가 되돌아올 때
    //기존 state 값들을 초기화
    useFocusEffect(
        useCallback(() => {
            return () => dispatch({ type: AuthFormTypes.RESET });
        }, [])
    );

    return (
        <SafeInputView>
            <View style={[styles.container, { marginTop: top }]}>

                {/*로그인 정보 입력 폼*/}
                <View style={[styles.form, { paddingBottom: bottom ? bottom + 10 : 40 }]}
                      contentContainerStyle={{ alignItems: 'center' }}
                      bounces={false}
                      keyboardShouldPersistTaps={'always'}>

                    <TextInput
                        mode={'outlined'}
                        outlineStyle={{ borderWidth: 1 }}
                        outlineColor='#0000001F'
                        label='아이디'
                        value={form.id}
                        style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                        onSubmitEditing={() => passwordRef.current.focus()}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => updateForm({ id: text.trim() })}
                    />

                    <TextInput
                        ref={passwordRef}
                        mode='outlined'
                        outlineStyle={{ borderWidth: 1 }}
                        outlineColor='#0000001F'
                        label='비밀번호'
                        value={form.password}
                        style={{ width: '100%', marginBottom: 20, backgroundColor: WHITE }}
                        returnKeyType={ReturnKeyTypes.DONE}
                        onChangeText={(text) => updateForm({ password: text.trim() })}
                        secureTextEntry={isHidePassword}
                        onSubmitEditing={onSignIn}
                        right={
                            <TextInput.Icon
                                forceTextInputFocus={false}
                                icon={isHidePassword ? 'eye-off' : 'eye'}
                                onPress={() => {
                                    setHidePassword(!isHidePassword);
                                    return false;
                                }}
                            />
                        }
                    />

                    {/*자동 로그인 체크박스*/}
                    <View style={{ width: '100%', alignItems: 'flex-start', left: 8 }}>
                        <BouncyCheckbox
                            style={{justifyContent:'center'}}
                            size={20}
                            fillColor={PRIMARY.DEFAULT}
                            unfillColor='#FFFFFF'
                            textStyle={{ textDecorationLine: 'none', fontSize: 12, color: PRIMARY.DEFAULT }}
                            text='자동 로그인'
                            onPress={(isChecked) => {
                                setAutoLogin(isChecked);
                            }}
                        />
                    </View>


                    {/*로그인 버튼*/}
                    <Button title='로그인'
                            onPress={onSignIn}
                            disabled={form.disabled}
                            isLoading={form.isLoading}
                            styles={{
                                container: {
                                    marginTop: 20
                                },
                                button: {
                                    borderRadius: 4
                                }
                            }} />
                    <View />


                    {/*회원가입*/}
                    <View style={styles.signUp}>
                        <Text style={{ color: '#879194' }}>아직 회원이 아니신가요?</Text>
                        <TextButton onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)} title={'회원 가입'}
                                    styles={{
                                        button: {
                                            marginStart: 10
                                        },
                                        title: {
                                            textDecorationLine: 'underline'
                                        }
                                    }} />
                    </View>
                </View>

                <Pressable onPress={onSignInKaKao}>
                    <Image style={
                        { width: width - 40, height: 50, alignSelf: 'center', marginBottom: 20 }}
                           source={require('../../../assets/background/bg_kakao_login.png')} />
                </Pressable>
            </View>
        </SafeInputView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    form: {
        flex: 1,
        backgroundColor: WHITE,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    signUp: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center'
    }
});

export default SignInScreen;
