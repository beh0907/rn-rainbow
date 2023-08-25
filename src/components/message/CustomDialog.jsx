import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useDialogState } from '../../contexts/DialogContext';

const CustomDialog = () => {
    const [dialog, setDialog] = useDialogState();
    const { title, message, onPress, visible, isConfirm } = dialog;

    const onConfirmDialog = async () => {
        await onPress()
        await onDismissDialog()
    }

    const onDismissDialog = () => setDialog({visible: false });

    return (
        <View>
            <Portal>
                <Dialog visible={visible} onDismiss={onDismissDialog}>
                    {/*타이틀이 있을 때만 타이틀을 표시한다*/}
                    {title && <Dialog.Title>{title}</Dialog.Title>}
                    <Dialog.Content>
                        <Text variant='bodyMedium'>{message}</Text>
                    </Dialog.Content>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Dialog.Actions>
                            {isConfirm && <Button onPress={onDismissDialog}>닫기</Button>}
                            {onPress && <Button onPress={onConfirmDialog}>확인</Button>}
                        </Dialog.Actions>
                    </View>


                </Dialog>
            </Portal>
        </View>
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

export default CustomDialog;
