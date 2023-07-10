import React from 'react';
import PropTypes from 'prop-types';
import {Pressable, StyleSheet, Text} from "react-native";
import {PRIMARY} from "../Colors";

const TextButton = ({styles, title, onPress, hitslop}) => {
    return (
        <Pressable onPress={onPress}
                   hitSlop={hitslop ? hitslop : 10}
                   style={[styles?.button]}>

            <Text style={[defaultStyles.title, styles?.title]}>{title}</Text>
        </Pressable>
    );
};

TextButton.propTypes = {
    styles: PropTypes.object,
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    hitslop: PropTypes.number
};

const defaultStyles = StyleSheet.create({
    title: {
        color: PRIMARY.DEFAULT,
        fontSize: 14,
        fontWeight: '700'
    },
});

export default TextButton;
