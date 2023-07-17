import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Portal, Snackbar} from 'react-native-paper';
import {useUserState} from "../../contexts/UserContext";
import {useMessageState} from "../../contexts/MessageContext";

const SnackBar = () => {
    const [message, setMessage] = useMessageState()
    const {snackMessage, snackVisible} = message;

    const onDismissSnackBar = () => setMessage(prev => ({...prev, snackVisible: false}));

    return (
        <View style={styles.popupArea}>
            <Portal>
                <Snackbar
                    duration={2000}
                    visible={snackVisible}
                    onDismiss={onDismissSnackBar}
                    action={{
                        // label: '확인',
                        onPress: () => {
                            // Do something
                        },
                    }}>
                    {snackMessage}
                </Snackbar>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    popupArea: {
        position: "absolute",
        backgroundColor: '#ccc',
        margin: 8,
        padding: 8,
        minHeight: 90
    },
});


export default SnackBar;
