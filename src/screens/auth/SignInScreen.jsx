import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {Alert, Image, Keyboard, ScrollView, StyleSheet, Text, View} from "react-native";
import {AuthRoutes} from "../../navigations/Routes";
import {ReturnKeyTypes} from "../../components/Input";
import Button from "../../components/button/Button";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import SafeInputView from "../../components/view/SafeInputView";
import TextButton from "../../components/button/TextButton";
import {StatusBar} from "expo-status-bar";
import {PRIMARY, WHITE} from "../../Colors";
import {authFormReducer, AuthFormTypes, initAuthForm} from "../../reducer/AuthFormReducer";
import {useUserState} from "../../contexts/UserContext";
import {getAuthMessages, signIn} from "../../api/Auth";
import * as SecureStore from "../../utils/PreferenceStore";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {TextInput} from "react-native-paper";
import {STORE_USER_KEYS} from "../../utils/PreferenceStore";

const SignInScreen = () => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const passwordRef = useRef()

    const [form, dispatch] = useReducer(authFormReducer, initAuthForm)
    const [, setUser] = useUserState()
    const [isAutoLogin, setAutoLogin] = useState(false)
    const [isHidePassword, setHidePassword] = useState(true)

    const onSubmit = async () => {
        Keyboard.dismiss()

        if (!form.disabled && !form.isLoading) {
            dispatch({type: AuthFormTypes.TOGGLE_LOADING})

            try {
                const user = await signIn(form)

                //자동 로그인이 체크되어 있다면
                //로그인 정보를 저장한다
                if (isAutoLogin) {
                    await SecureStore.save(STORE_USER_KEYS.ID, user.id)
                    await SecureStore.save(STORE_USER_KEYS.Password, form.password)
                } else {
                    await SecureStore.save(STORE_USER_KEYS.ID, "")
                    await SecureStore.save(STORE_USER_KEYS.Password, "")
                }

                setUser(user)
                console.log(user)
            } catch (e) {
                Alert.alert('로그인 실패', getAuthMessages(e.response.status), [{
                    text: '확인',
                    onPress: () => dispatch({type: AuthFormTypes.TOGGLE_LOADING})
                }])
            }
        }
    }
    const updateForm = payload => {
        const newForm = {...form, ...payload}
        const disabled = !newForm.id || !newForm.password

        dispatch({
            type: AuthFormTypes.UPDATE_FORM,
            payload: {disabled, ...payload}
        })
    }

    //다른 화면에서 로그인 화면으로 포커스가 되돌아올 때
    //기존 state 값들을 초기화
    useFocusEffect(

        useCallback(() => {
            return () => dispatch({type: AuthFormTypes.RESET})
        }, [])
    )

    return (
        <SafeInputView>
            <StatusBar style={"dark"}/>
            <View style={[styles.container, {marginTop: top}]}>

                {/*<View>*/}
                {/*    <Image source={require('../../../assets/icon.png')}/>*/}
                {/*    <Text variant="headlineLarge">레인보우브릿지</Text>*/}
                {/*</View>*/}

                {/*로그인 정보 입력 폼*/}
                <ScrollView style={[styles.form, {paddingBottom: bottom ? bottom + 10 : 40}]}
                            contentContainerStyle={{alignItems: 'center'}}
                            bounces={false}
                            keyboardShouldPersistTaps={'always'}>

                    <TextInput
                        mode={"outlined"}
                        outlineStyle={{borderWidth: 1}}
                        outlineColor='#0000001F'
                        label="아이디"
                        value={form.id}
                        style={{width: '100%', marginBottom: 20, fontSize: 14, backgroundColor: WHITE}}
                        onSubmitEditing={() => passwordRef.current.focus()}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => updateForm({id: text.trim()})}
                    />

                    <TextInput
                        ref={passwordRef}
                        mode="outlined"
                        outlineStyle={{borderWidth: 1}}
                        outlineColor='#0000001F'
                        label="비밀번호"
                        value={form.password}
                        style={{width: '100%', marginBottom: 20, fontSize: 14, backgroundColor: WHITE}}
                        returnKeyType={ReturnKeyTypes.DONE}
                        onChangeText={(text) => updateForm({password: text.trim()})}
                        secureTextEntry={isHidePassword}
                        onSubmitEditing={onSubmit}
                        right={
                            <TextInput.Icon
                                forceTextInputFocus={false}
                                icon={isHidePassword ? "eye-off" : "eye"}
                                onPress={() => {
                                    setHidePassword(!isHidePassword);
                                    return false;
                                }}
                            />
                        }
                    />

                    {/*자동 로그인 체크박스*/}
                    <View style={{width: '100%', alignItems: 'flex-start', left: 8}}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={PRIMARY.DEFAULT}
                            unfillColor="#FFFFFF"
                            textStyle={{textDecorationLine: 'none', fontSize: 12, color: PRIMARY.DEFAULT}}
                            text="자동 로그인"
                            onPress={(isChecked) => {
                                setAutoLogin(isChecked)
                            }}
                        />
                    </View>


                    {/*로그인 버튼*/}
                    <Button title="로그인"
                            onPress={onSubmit}
                            disabled={form.disabled}
                            isLoading={form.isLoading}
                            styles={{
                                container: {
                                    marginTop: 20
                                },
                                button: {
                                    borderRadius: 4
                                }
                            }}/>

                    <View/>


                    {/*회원가입*/}
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Text style={{color: '#879194'}}>아직 회원이 아니신가요?</Text>
                        <TextButton onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)} title={"회원 가입"}
                                    styles={{
                                        button: {
                                            marginStart: 10
                                        },
                                        title: {
                                            textDecorationLine: 'underline'
                                        }
                                    }}/>
                    </View>
                </ScrollView>
            </View>
        </SafeInputView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    form: {
        flexGrow: 0,
        backgroundColor: WHITE,
        paddingHorizontal: 20,
        paddingTop: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    }
})

export default SignInScreen;
