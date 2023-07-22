import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context";
import {DatePickerModal} from "react-native-paper-dates";
import {Button} from "react-native-paper";
import SwitchSelector from "react-native-switch-selector";
import {PRIMARY, WHITE} from "../../Colors";


const RoomRegisterScreen = props => {
    const {top, bottom} = useSafeAreaInsets();
    const [date, setDate] = useState(undefined);
    const [open, setOpen] = useState(false);

    const [room, setRoom] = useState({})

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
            <DatePickerModal
                locale="ko"
                mode="single"
                visible={open}
                onDismiss={onDismiss}
                date={date}
                onConfirm={onConfirm}
            />

            <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                <SwitchSelector
                    initial={1}
                    onPress={value => setRoom(prevState => ({
                        ...prevState,
                        gender: value
                    }))}
                    textColor={PRIMARY.DEFAULT} //'#7a44cf'
                    selectedColor={WHITE}
                    buttonColor={PRIMARY.DEFAULT}
                    borderColor={PRIMARY.DEFAULT}
                    hasPadding
                    options={[
                        {label: "Female", value: 1, imageIcon: require("../../../assets/icon/ic_female.png")}, //images.feminino = require('./path_to/assets/img/feminino.png')
                        {label: "Male", value: 0, imageIcon: require("../../../assets/icon/ic_male.png")} //images.masculino = require('./path_to/assets/img/masculino.png')
                    ]}
                    testID="gender-switch-selector"
                    accessibilityLabel="gender-switch-selector"
                />
                <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                    Pick single date
                </Button>

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
