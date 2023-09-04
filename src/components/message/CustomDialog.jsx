import * as React from 'react';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Divider, Portal, Text } from 'react-native-paper';
import { useDialogState } from '../../contexts/DialogContext';
import { GRAY, PRIMARY } from '../../Colors';

export const DIALOG_MODE = {
    ALERT: 'alert',
    CONFIRM: 'confirm',
    LOADING: 'loading'
};

const CustomDialog = () => {
    const [dialog, setDialog] = useDialogState();
    const { title, message, onPress, visible, isConfirm, mode } = dialog;

    const onConfirmDialog = useCallback(async () => {
        await onPress();
        await onDismissDialog();
    }, [dialog]);

    const onDismissDialog = useCallback(() => setDialog({ visible: false }), [dialog]);

    return (
        <Portal>
            {(() => {
                switch (mode) {
                    case DIALOG_MODE.ALERT:
                        return (
                            <Dialog visible={visible} onDismiss={onDismissDialog} dismissable={false}>
                                <Dialog.Title>{title}</Dialog.Title>
                                <Dialog.Content>
                                    <Text variant='bodyMedium'>{message}</Text>
                                </Dialog.Content>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Dialog.Actions>
                                        <Button onPress={onConfirmDialog}>확인</Button>
                                    </Dialog.Actions>
                                </View>
                            </Dialog>
                        );

                    case DIALOG_MODE.CONFIRM:
                        return (
                            <Dialog visible={visible} onDismiss={onDismissDialog} dismissable={false}>
                                <Dialog.Title>{title}</Dialog.Title>
                                <Dialog.Content>
                                    <Text variant='bodyMedium'>{message}</Text>
                                </Dialog.Content>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Dialog.Actions>
                                        <Button onPress={onDismissDialog}>닫기</Button>
                                        <Button onPress={onConfirmDialog}>확인</Button>
                                    </Dialog.Actions>
                                </View>
                            </Dialog>
                        );

                    case DIALOG_MODE.LOADING:
                        return (
                            <Dialog visible={visible} onDismiss={onDismissDialog} dismissable={false}>
                                <Dialog.Content style={{ flexDirection: 'row', alignItems:'center' }}>
                                    <ActivityIndicator size='small' color={PRIMARY.DEFAULT} />
                                    <Divider horizontalInset/>
                                    <Text variant='bodyMedium'>{message}</Text>
                                </Dialog.Content>
                            </Dialog>
                        );
                }
            })()}
        </Portal>
    );
};

export default CustomDialog;
