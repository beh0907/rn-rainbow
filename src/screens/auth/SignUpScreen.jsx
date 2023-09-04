import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Alert, Keyboard, ScrollView, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import TextButton from "../../components/button/TextButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PRIMARY, WHITE} from "../../Colors";
import {StatusBar} from "expo-status-bar";
import {ReturnKeyTypes} from "../../components/view/Input";
import Button from "../../components/button/Button";
import SafeInputView from "../../components/view/SafeInputView";
import {authFormReducer, AuthFormTypes, initAuthForm} from "../../reducer/AuthFormReducer";
import {useUserState} from "../../contexts/UserContext";
import {TextInput} from "react-native-paper";
import {signUp} from "../../api/Auth";
import {useSnackBarState} from "../../contexts/SnackBarContext";
import { useDialogState } from '../../contexts/DialogContext';
import { DIALOG_MODE } from '../../components/message/CustomDialog';

const SignUpScreen = () => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const nickNameRef = useRef()
    const mailRef = useRef()

    const [form, dispatch] = useReducer(authFormReducer, initAuthForm);
    const [, setUser] = useUserState() // 글로벌 유저 상태정보
    const [, setSnackbar] = useSnackBarState() // 글로벌 알림 메시지 상태정보
    const [, setDialog] = useDialogState()

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

                //스낵바 출력 셋팅
                setSnackbar({
                    snackMessage: (user.id === null ? "회원가입에 실패하였습니다." : "회원가입을 성공하였습니다."),
                    visible: true
                })

                // 회원가입 성공 시 로그인 화면으로 이동
                if (user.id !== null)
                    navigation.goBack()
            } catch (e) {
                setDialog({
                    title: '로그인 실패',
                    message: '오류 발생',
                    onPress: async () => {
                        dispatch({ type: AuthFormTypes.TOGGLE_LOADING })
                    },
                    visible: true,
                    mode: DIALOG_MODE.ALERT
                });
            }
        }
    }

    return (
        <SafeInputView>
            <StatusBar style={"dark"}/>
            <View style={[styles.container, {marginTop: top}]}>

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
                        style={{width: '100%', backgroundColor: WHITE}}
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
                        style={{width: '100%', marginTop: 20, backgroundColor: WHITE}}
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
                        // activeOutlineColor={PRIMARY.DEFAULT}
                        // selectionColor={PRIMARY.DEFAULT}
                        label="비밀번호 확인"
                        value={form.passwordConfirm}
                        style={{width: '100%', marginTop: 20, backgroundColor: WHITE}}
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
                        label="닉네임"
                        value={form.nickName}
                        style={{width: '100%', marginTop: 20, backgroundColor: WHITE}}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onChangeText={(text) => updateForm({nickName: text.trim()})}
                        onSubmitEditing={() => mailRef.current.focus()}
                    />

                    <TextInput
                        ref={mailRef}
                        mode="outlined"
                        outlineStyle={{borderWidth: 1}}
                        outlineColor='#0000001F'
                        label="이메일"
                        value={form.mail}
                        style={{width: '100%', marginTop: 20, backgroundColor: WHITE}}
                        returnKeyType={ReturnKeyTypes.DONE}
                        onChangeText={(text) => updateForm({mail: text.trim()})}
                        onSubmitEditing={onSubmit}
                    />

                    <Button title="회원가입"
                            onPress={onSubmit}
                            disabled={form.disabled}
                            isLoading={form.isLoading}
                            styles={{
                                button: {
                                    marginTop: 20,
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
