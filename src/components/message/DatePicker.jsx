import DateTimePicker from '@react-native-community/datetimepicker';
import { forwardRef } from 'react';
import { SafeAreaView } from 'react-native';
import { PRIMARY } from '../../Colors';

const DatePicker = forwardRef(({ date, setDate, setShow }, ref) => {
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        ref.current.focus();
    };

    return (
        <SafeAreaView>
            <DateTimePicker
                testID='datePicker'
                locale={'ko'}
                textColor={PRIMARY.DEFAULT}
                value={date}
                mode={'date'}
                onChange={onChange}
            />
        </SafeAreaView>
    );
});

export default DatePicker;

