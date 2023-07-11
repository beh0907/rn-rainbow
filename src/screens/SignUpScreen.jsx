import React, {useReducer, useRef, useState} from 'react';
import {Alert, Keyboard, ScrollView, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import TextButton from "../components/TextButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PRIMARY, WHITE} from "../Colors";
import {StatusBar} from "expo-status-bar";
import Input, {InputTypes, ReturnKeyTypes} from "../components/Input";
import Button from "../components/Button";
import HR from "../components/HR";
import SafeInputView from "../components/SafeInputView";
import {authFormReducer, AuthFormTypes, initAuthForm} from "../reducer/AuthFormReducer";
import {useUserState} from "../contexts/UserContext";
import {TextInput} from "react-native-paper";
import {AuthRoutes} from "../navigations/Routes";
import {signUp} from "../api/Auth";
import * as SecureStore from "../utils/PreferenceStore";

const SignUpScreen = () => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const nickNameRef = useRef()
    const mailRef = useRef()

    const [form, dispatch] = useReducer(authFormReducer, initAuthForm);
    const [, setUser] = useUserState()

    const [isHidePassword, setHidePassword] = useState(true)
    const [isHidePasswordConfirm, setHidePasswordConfirm] = useState(true)

    const updateForm = (payload) => {
        const newForm = {...form, ...payload};
        const disabled =
            !newForm.id ||
            !newForm.password ||
            newForm.password !== newForm.passwordConfirm ||
            !newForm.nickName ||
            !newForm.mail;

        dispatch({
            type: AuthFormTypes.UPDATE_FORM,
            payload: {disabled, ...payload},
        });
    }

    const onSubmit = async () => {
        Keyboard.dismiss()

        if (!form.disabled && !form.isLoading) {
            dispatch({type: AuthFormTypes.TOGGLE_LOADING})

            try {
                //회원가입 시도 실패 시 null
                const user = await signUp(form)

                //회원가입 정보를 로컬저장소에 저장한다
                await SecureStore.save("id", user.id)
                await SecureStore.save("password", form.password)

                // 회원가입 성공 시 자동 로그인
                setUser(user)
            } catch (e) {
                // const errorMessage = getAuthErrorMessages(e.code)
                Alert.alert('회원가입 실패', errorMessage, [{
                    text: '확인',
                    onPress: () => dispatch({type: AuthFormTypes.TOGGLE_LOADING})
                }])
            }
        }
    }

    return (
        <SafeInputView>
            <StatusBar style={"light"}/>
            <View style={[styles.container, {paddingTop: top}]}>

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
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => updateForm({password: text.trim()})}
                        secureTextEntry={isHidePassword}
                        onSubmitEditing={() => passwordConfirmRef.current.focus()}
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

                    <TextInput
                        ref={passwordConfirmRef}
                        mode="outlined"
                        outlineStyle={{borderWidth: 1}}
                        outlineColor='#0000001F'
                        activeOutlineColor={PRIMARY.DEFAULT}
                        selectionColor={PRIMARY.DEFAULT}
                        label="비밀번호 확인"
                        value={form.passwordConfirm}
                        style={{width: '100%', marginBottom: 20, fontSize: 14, backgroundColor: WHITE}}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => updateForm({passwordConfirm: text.trim()})}
                        secureTextEntry={isHidePasswordConfirm}
                        onSubmitEditing={() => nickNameRef.current.focus()}
                        right={
                            <TextInput.Icon
                                forceTextInputFocus={false}
                                icon={isHidePasswordConfirm ? "eye-off" : "eye"}
                                onPress={() => {
                                    setHidePasswordConfirm(!isHidePasswordConfirm);
                                    return false;
                                }}
                            />
                        }
                    />

                    <TextInput
                        ref={nickNameRef}
                        mode="outlined"
                        outlineStyle={{borderWidth: 1}}
                        outlineColor='#0000001F'
                        activeOutlineColor={PRIMARY.DEFAULT}
                        selectionColor={PRIMARY.DEFAULT}
                        label="닉네임"
                        value={form.nickName}
                        style={{width: '100%', marginBottom: 20, fontSize: 14, backgroundColor: WHITE}}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => updateForm({nickName: text.trim()})}
                        onSubmitEditing={() => mailRef.current.focus()}
                    />

                    <TextInput
                        ref={mailRef}
                        mode="outlined"
                        outlineStyle={{borderWidth: 1}}
                        outlineColor='#0000001F'
                        activeOutlineColor={PRIMARY.DEFAULT}
                        selectionColor={PRIMARY.DEFAULT}
                        label="이메일"
                        value={form.mail}
                        style={{width: '100%', marginBottom: 20, fontSize: 14, backgroundColor: WHITE}}
                        returnKeyType={ReturnKeyTypes.DONE}
                        onChangeText={(text) => updateForm({mail: text.trim()})}
                        onSubmitEditing={onSubmit}
                    />

                    <Button title="회원가입"
                            onPress={onSubmit}
                            disabled={form.disabled}
                            isLoading={form.isLoading}
                            styles={{
                                // container: {
                                //     marginTop: 20,
                                // },
                                button: {
                                    borderRadius: 4
                                }
                            }}/>


                    {/*회원가입*/}
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Text style={{color: '#879194'}}>이미 등록된 회원이십니까?</Text>
                        <TextButton onPress={navigation.goBack} title={"로그인"}
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
export default SignUpScreen;
