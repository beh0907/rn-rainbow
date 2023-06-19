import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {Alert, Image, Keyboard, ScrollView, StyleSheet, Text, View} from "react-native";
import {AuthRoutes} from "../navigations/Routes";
import Input, {InputTypes, ReturnKeyTypes} from "../components/Input";
import Button from "../components/Button";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import SafeInputView from "../components/SafeInputView";
import TextButton from "../components/TextButton";
import HR from "../components/HR";
import {StatusBar} from "expo-status-bar";
import {WHITE} from "../colors";
import {authFormReducer, initAuthForm, AuthFormTypes} from "../reducer/AuthFormReducer";
import {useUserState} from "../contexts/UserContext";
import {getAuthMessages, signIn} from "../api/Auth";
import * as SecureStore from "../utils/SecureStore";

const SignInScreen = () => {
    const navigation = useNavigation()
    const {top, bottom} = useSafeAreaInsets()

    const passwordRef = useRef()

    const [form, dispatch] = useReducer(authFormReducer, initAuthForm)
    const [,setUser] = useUserState()

    const onSubmit = async () => {
        Keyboard.dismiss()

        if (!form.disabled && !form.isLoading) {
            dispatch({type: AuthFormTypes.TOGGLE_LOADING})

            try {
                const user = await signIn(form)

                setUser(user)
                console.log(user)

                await SecureStore.save("id", user.id)
                await SecureStore.save("password", user.password)
            } catch (e) {
                Alert.alert('로그인 실패', getAuthMessages(e.response.status), [{
                    text:'확인',
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
                <View style={StyleSheet.absoluteFill}>
                    <Image source={require('../../assets/cover.png')} style={{width: '100%'}} resizeMode={"cover"}/>
                </View>

                <ScrollView style={[styles.form, {paddingBottom: bottom ? bottom + 10 : 40}]}
                            contentContainerStyle={{alignItems: 'center'}}
                            bounces={false}
                            keyboardShouldPersistTaps={'always'}>
                    <Input
                        styles={{
                            container: {marginBottom: 20},
                        }}
                        value={form.id}
                        onChangeText={(text) => updateForm({id: text.trim()})}
                        inputType={InputTypes.ID}
                        returnKeyType={ReturnKeyTypes.NEXT}
                        onSubmitEditing={() => passwordRef.current.focus()}
                    />
                    <Input
                        ref={passwordRef}
                        styles={{
                            container: {marginBottom: 20},
                        }}
                        value={form.password}
                        onChangeText={(text) => updateForm({password: text.trim()})}
                        inputType={InputTypes.PASSWORD}
                        returnKeyType={ReturnKeyTypes.DONE}
                        onSubmitEditing={onSubmit}
                    />

                    <Button title="로그인"
                            onPress={onSubmit}
                            disabled={form.disabled}
                            isLoading={form.isLoading}
                            style={{
                                container: {
                                    marginTop: 20
                                }
                            }}/>


                    <HR text={'OR'} styles={{container: {marginVertical: 30}}}/>

                    <TextButton onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)} title={"회원 가입"}/>
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

export default SignInScreen;
