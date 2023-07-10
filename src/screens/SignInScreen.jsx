import React, {useCallback, useReducer, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {Alert, Keyboard, ScrollView, StyleSheet, Text, View} from "react-native";
import {AuthRoutes} from "../navigations/Routes";
import {ReturnKeyTypes} from "../components/Input";
import Button from "../components/Button";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import SafeInputView from "../components/SafeInputView";
import TextButton from "../components/TextButton";
import {StatusBar} from "expo-status-bar";
import {PRIMARY, WHITE} from "../Colors";
import {authFormReducer, AuthFormTypes, initAuthForm} from "../reducer/AuthFormReducer";
import {useUserState} from "../contexts/UserContext";
import {getAuthMessages, signIn} from "../api/Auth";
import * as SecureStore from "../utils/PreferenceStore";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {IconButton, TextInput} from "react-native-paper";

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

                await SecureStore.save("id", user.id)
                await SecureStore.save("password", form.password)

                setUser(user)
                console.log(user)
                console.log(form.password)

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
            <StatusBar style={"light"}/>
            <View style={[styles.container, {paddingTop: top}]}>

                {/*로그인 정보 입력 폼*/}
                <ScrollView style={[styles.form, {paddingBottom: bottom ? bottom + 10 : 40}]}
                            contentContainerStyle={{alignItems: 'center'}}
                            bounces={false}
                            keyboardShouldPersistTaps={'always'}>

                    <TextInput
                        mode={"outlined"}
                        outlineStyle={{borderWidth: 1}}
                        outlineColor='#0000001F'
                        activeOutlineColor={PRIMARY.DEFAULT}
                        selectionColor={PRIMARY.DEFAULT}
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
                        activeOutlineColor={PRIMARY.DEFAULT}
                        selectionColor={PRIMARY.DEFAULT}
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

                    {/*<Input*/}
                    {/*    styles={{*/}
                    {/*        container: {marginBottom: 20},*/}
                    {/*    }}*/}
                    {/*    value={form.id}*/}
                    {/*    onChangeText={(text) => updateForm({id: text.trim()})}*/}
                    {/*    inputType={InputTypes.ID}*/}
                    {/*    returnKeyType={ReturnKeyTypes.NEXT}*/}
                    {/*    onSubmitEditing={() => passwordRef.current.focus()}*/}
                    {/*/>*/}
                    {/*<Input*/}
                    {/*    ref={passwordRef}*/}
                    {/*    styles={{*/}
                    {/*        container: {marginBottom: 20},*/}
                    {/*    }}*/}
                    {/*    value={form.password}*/}
                    {/*    onChangeText={(text) => updateForm({password: text.trim()})}*/}
                    {/*    inputType={InputTypes.PASSWORD}*/}
                    {/*    returnKeyType={ReturnKeyTypes.DONE}*/}
                    {/*    onSubmitEditing={onSubmit}*/}
                    {/*/>*/}

                    {/*자동 로그인 체크박스*/}
                    <View style={{width: '100%', alignItems: 'flex-start', left: 8}}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={PRIMARY.DEFAULT}
                            unfillColor="#FFFFFF"
                            textStyle={{textDecorationLine: 'none', fontSize: 12, color: PRIMARY.DEFAULT}}
                            text="자동 로그인"
                            iconStyle={{borderColor: PRIMARY.DEFAULT}}
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
