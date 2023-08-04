import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from "react-native";
import {DANGER, GRAY, PRIMARY, WHITE} from "../../Colors";

export const ButtonTypes = {
    PRIMARY: 'PRIMARY',
    DANGER: 'DANGER',
    CANCLE: 'CANCLE',
}

const ButtonTypeColors = {
    PRIMARY: {
        LIGHT: PRIMARY.LIGHT,
        DEFAULT: PRIMARY.DEFAULT,
        DARK: PRIMARY.DARK
    },
    DANGER: {
        LIGHT: DANGER.LIGHT,
        DEFAULT: DANGER.DEFAULT,
        DARK: DANGER.DARK
    },
    CANCLE: {
        LIGHT: GRAY.LIGHT,
        DEFAULT: GRAY.DEFAULT,
        DARK: GRAY.DARK
    },
}

const Button = ({styles, title, onPress, disabled, isLoading, buttonType}) => {
    const Colors = ButtonTypeColors[buttonType]

    return (
        <View style={[defaultStyles.container, styles?.container]}>
            <Pressable onPress={onPress} disabled={disabled || isLoading}
                       style={({pressed}) => [
                           defaultStyles.button,
                           {
                               backgroundColor: (() => {
                                   switch (true) {
                                       case disabled || isLoading:
                                           return Colors.LIGHT;
                                       case pressed:
                                           return Colors.DARK;
                                       default:
                                           return Colors.DEFAULT;
                                   }
                               })(),
                           },
                           styles?.button,
                       ]}>

                {isLoading ? <ActivityIndicator size="small" color={GRAY.DARK}/>
                    : <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>}

            </Pressable>
        </View>
    );
};

Button.defaultProps = {
    buttonType:ButtonTypes.PRIMARY
}

Button.propTypes = {
    styles: PropTypes.object,
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    buttonType: PropTypes.oneOf(Object.values(ButtonTypes)),
};

const defaultStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    button: {
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: WHITE,
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 20,
    },
});

export default Button;
