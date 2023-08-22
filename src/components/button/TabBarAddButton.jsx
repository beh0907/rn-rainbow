import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY, WHITE } from '../../Colors';
import { MainRoutes } from '../../navigations/Routes';
import { IconButton } from 'react-native-paper';
import React from 'react';

const TabBarAddButton = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <IconButton icon={'plus'} containerColor={PRIMARY.DEFAULT} iconColor={WHITE}
                        mode='contained' onPress={() => navigation.navigate(MainRoutes.ROOM_REGISTER)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: PRIMARY.DEFAULT,
        borderRadius: 999,
        padding: 4,
    },
});

export default TabBarAddButton;
