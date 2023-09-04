import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { useSnackBarState } from '../../contexts/SnackBarContext';

const CustomSnackBar = () => {
    const [snackBar, setSnackbar] = useSnackBarState();
    const { message, visible } = snackBar;

    const onDismissSnackBar = () => setSnackbar(prev => ({ ...prev, visible: false }));

    return (
        <Portal style={styles.popupArea}>
            <Snackbar
                duration={2000}
                visible={visible}
                onDismiss={onDismissSnackBar}
                // action={{
                //     label: '확인',
                //     onPress: () => {
                //     },
                // }}
            >
                {message}
            </Snackbar>
        </Portal>
    );
};

const styles = StyleSheet.create({
    popupArea: {
        position: 'absolute',
        backgroundColor: '#ccc',
        margin: 8,
        padding: 8,
        minHeight: 90
    }
});


export default CustomSnackBar;
