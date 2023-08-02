import DateTimePicker from '@react-native-community/datetimepicker';
import SafeInputView from './SafeInputView';
import { forwardRef } from 'react';
import { SafeAreaView } from 'react-native';
import { PRIMARY } from '../../Colors';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = forwardRef(({date, setDate, show, setShow}, ref) => {
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        ref.current.focus()
    };

    return (
        <SafeAreaView>
            {show && (
                <DateTimePicker
                    testID="datePicker"
                    locale={"ko"}
                    textColor={PRIMARY.DEFAULT}
                    value={date}
                    mode={'date'}
                    onChange={onChange}
                />
            )}
        </SafeAreaView>
    );
});

export default DatePicker;

