import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Alert, Image, Keyboard, ScrollView, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import TextButton from "../components/TextButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {WHITE} from "../colors";
import {StatusBar} from "expo-status-bar";
import Input, {InputTypes, ReturnKeyTypes} from "../components/Input";
import Button from "../components/Button";
import HR from "../components/HR";
import SafeInputView from "../components/SafeInputView";
import {authFormReducer, initAuthForm, AuthFormTypes} from "../reducer/AuthFormReducer";
import {useUserState} from "../contexts/UserContext";

const SignUpScreen = () => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [form, dispatch] = useReducer(authFormReducer, initAuthForm);
    const [, setUser] = useUserState()

    const updateForm = (payload) => {
        const newForm = { ...form, ...payload };
        const disabled =
            !newForm.id ||
            !newForm.password ||
            newForm.password !== newForm.passwordConfirm;

        dispatch({
            type: AuthFormTypes.UPDATE_FORM,
            payload: { disabled, ...payload },
        });
    }

    const onSubmit = async () => {
        Keyboard.dismiss()

        if (!form.disabled && !form.isLoading) {
            dispatch({type: AuthFormTypes.TOGGLE_LOADING})

            try {
                // const user = await signUp(form)
                setUser(user) // 회원가입 성공 시 자동 로그인
            } catch (e) {
                // const errorMessage = getAuthErrorMessages(e.code)
                Alert.alert('회원가입 실패', errorMessage, [{
                    text:'확인',
                    onPress: () => dispatch({type: AuthFormTypes.TOGGLE_LOADING})
                }])
            }
        }
    }

    return (
        <SafeInputView>
            <StatusBar style={"light"}/>
            <View style={[styles.container, {paddingTop: top}]}>
                <View style={StyleSheet.absoluteFill}>
                    <Image source={require('../../assets/cover.png')} style={{width: '100%'}} resizeMode={"cover"}/>
                </View>

                <ScrollView style={[styles.form, {paddingBottom: bottom ? bottom + 10 : 40}]}
                            contentContainerStyle={{alignItems: 'center'}}
                            bounces={false}
                            keyboardShouldPersistTaps={'always'}>
                    <Input
                        value={form.id}
                        onChangeText={(text) => updateForm({ id: text.trim() })}
                        inputType={InputTypes.ID}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onSubmitEditing={() => passwordRef.current.focus()}
                        styles={{ container: { marginBottom: 20 } }}
                    />
                    <Input
                        ref={passwordRef}
                        value={form.password}
                        onChangeText={(text) => updateForm({ password: text.trim() })}
                        inputType={InputTypes.PASSWORD}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onSubmitEditing={() => passwordConfirmRef.current.focus()}
                        styles={{ container: { marginBottom: 20 } }}
                    />
                    <Input
                        ref={passwordConfirmRef}
                        value={form.passwordConfirm}
                        onChangeText={(text) =>
                            updateForm({ passwordConfirm: text.trim() })
                        }
                        inputType={InputTypes.PASSWORD_CONFIRM}
                        returnKeyType={ReturnKeyTypes.DONE}
                        onSubmitEditing={onSubmit}
                        styles={{ container: { marginBottom: 20 } }}
                    />

                    <Button title="회원가입"
                            onPress={onSubmit}
                            disabled={form.disabled}
                            isLoading={form.isLoading}
                            style={{
                                container: {
                                    marginTop: 20
                                }
                            }}/>


                    <HR text={'OR'} styles={{container: {marginVertical: 30}}}/>

                    <TextButton title={"로그인"} onPress={navigation.goBack}/>
                </ScrollView>
            </View>
        </SafeInputView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
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
