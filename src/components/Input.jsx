import React, {forwardRef, useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {BLACK, GRAY, PRIMARY} from "../colors";

export const KeyboardTypes = {
    DEFAULT: 'default',
    EMAIL: 'email-address'
}

export const ReturnKeyTypes = {
    DONE: 'done',
    NEXT: 'next'
}

export const InputTypes = {
    ID: 'ID',
    PASSWORD: 'PASSWORD',
    PASSWORD_CONFIRM: 'PASSWORD_CONFIRM',
}

export const PasswordProps = {
    keyboardType: 'default',
    secureTextEntry: true,
    iconName: {active: 'lock', inactive: 'lock-outline'}
}

const InputTypeProps = {
    ID: {
        title: "ID",
        placeholder: "ID를 입력해주세요.",
        keyboardType: 'default',
        secureTextEntry: false,
        iconName: {active: "email", inactive: 'email-outline'},
    },
    PASSWORD: {
        title: "PASSWORD",
        placeholder: "비밀번호를 입력해주세요.",
        keyboardType: 'default',
        secureTextEntry: true,
        iconName: {active: "lock", inactive: 'lock-outline'},
        ...PasswordProps
    },
    PASSWORD_CONFIRM: {
        title: "PASSWORD CONFIRM",
        placeholder: "비밀번호를 한번 더 입력해주세요.",
        ...PasswordProps
    }
}

const Input = forwardRef(({inputType, styles, ...props}, ref) => {
    const {
        title,
        placeholder,
        keyboardType,
        secureTextEntry,
        iconName: {active, inactive}
    } = InputTypeProps[inputType]
    const {value} = props

    const [isFocused, setIsFocused] = useState(false)

    return (
        <View style={[defaultStyles.container, styles?.container]}>
            <Text
                style={[defaultStyles.title, {color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK}]}>{title}</Text>
            <View>
                <TextInput
                    ref={ref}
                    {...props}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={[defaultStyles.input, {
                        borderColor: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
                        color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK
                    }, styles?.input]}
                    textContentType={"none"}
                    autoCapitalize={"none"}
                    autoCorrect={false}/>

                <View style={[defaultStyles.icon, styles?.icon]}>
                    <MaterialCommunityIcons
                        name={isFocused ? active : inactive}
                        size={24}
                        color={value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK}
                    />
                </View>
            </View>
        </View>
    );
});

Input.displayName = 'Input'

Input.propTypes = {
    inputType: PropTypes.oneOf(Object.values(InputTypes)).isRequired,
    value: PropTypes.string.isRequired,
    styles: PropTypes.object,
};

const defaultStyles = StyleSheet.create({
    container: {
        width: '100%'
    },
    title: {
        marginBottom: 4,
        fontWeight: "700"
    },
    input: {
        borderBottomWidth: 1,
        borderRadius: 8,
        height: 42,
        paddingHorizontal: 10,
        paddingLeft: 40
    },
    icon: {
        position: 'absolute',
        left: 8,
        height: '100%',
        justifyContent: 'center'
    }
})

export default Input;
