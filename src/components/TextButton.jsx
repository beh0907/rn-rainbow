import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from "react-native";
import {GRAY, PRIMARY, WHITE} from "../colors";

const TextButton = ({styles, title, onPress, hitslop}) => {
    return (
        <Pressable onPress={onPress}
                   hitSlop={hitslop ? hitslop : 10}
                   style={styles?.button}>

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
        fontSize: 16,
        fontWeight: '700',
    },
});

export default TextButton;
