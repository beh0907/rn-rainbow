import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../../Colors';
import { Surface } from 'react-native-paper';

const inputTextButton = ({ value, onChangeText, placeholder, icon, onSubmit, styles, disabled }) => {
    return (
        <Surface style={[defaultStyles.container, styles?.input]}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={defaultStyles.input}
                onSubmitEditing={onSubmit}
            />
            <TouchableOpacity
                style={[defaultStyles.iconButton, disabled ? { backgroundColor: GRAY.DEFAULT } : { backgroundColor: PRIMARY.DEFAULT }]}
                onPress={onSubmit} disabled={disabled}>
                {/*<MaterialCommunityIcons name={icon} size={16} color={'white'}  />*/}
                <MaterialIcons name={icon} size={20} color={'white'} />
            </TouchableOpacity>
        </Surface>
    );
};

const defaultStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row'
    },
    input: {
        flex: 1
    },
    iconButton: {
        borderRadius: 50,
        padding: 6,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default inputTextButton;
