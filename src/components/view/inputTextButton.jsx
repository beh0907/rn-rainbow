import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY } from '../../Colors';
import { Surface } from 'react-native-paper';

const inputTextButton = ({ value, onChangeText, placeholder, icon, onSubmit, styles }) => {
    return (
        <Surface style={[defaultStyles.container, styles?.input]}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={defaultStyles.input}
            />
            <TouchableOpacity style={defaultStyles.iconButton} onPress={onSubmit}>
                <MaterialCommunityIcons name={icon} size={16} color={'white'} />
            </TouchableOpacity>
        </Surface>
        // <View style={[defaultStyles.container, styles?.input]}>
        //     <TextInput
        //         value={value}
        //         onChangeText={onChangeText}
        //         placeholder={placeholder}
        //         style={defaultStyles.input}
        //     />
        //     <TouchableOpacity style={defaultStyles.iconButton} onPress={onSubmit}>
        //         <MaterialCommunityIcons name={icon} size={16} color={'white'} />
        //     </TouchableOpacity>
        // </View>
    );
};

const defaultStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
    },
    input: {
        flex: 1,
    },
    iconButton: {
        backgroundColor: PRIMARY.DEFAULT,
        borderRadius: 50,
        padding: 8,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default inputTextButton;
