import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import {DatePickerInput, DatePickerModal} from "react-native-paper-dates";
import {addPeriodToDate} from "../../utils/checkInputForm";
import {Button} from "react-native-paper";


const RoomRegisterScreen = props => {
    const {top, bottom} = useSafeAreaInsets();
    const [date, setDate] = useState(undefined);
    const [open, setOpen] = useState(false);

    const onDismiss = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = useCallback(
        (params) => {
            setOpen(false);
            setDate(params.date);
            console.log(params.date)
        },
        [setOpen, setDate]
    );

    return (
        <SafeAreaProvider>
        <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
            <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                Pick single date
            </Button>
            <DatePickerModal
                locale="ko"
                mode="single"
                visible={open}
                onDismiss={onDismiss}
                date={date}
                onConfirm={onConfirm}
            />
        </View>
        </SafeAreaProvider>
    );
};

RoomRegisterScreen.propTypes = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default RoomRegisterScreen;
