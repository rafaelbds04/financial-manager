import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import styles from './styles';

interface DatePickerProps {
    date: Date,
    onChange: Function,
}


const DatePicker: React.FC<DatePickerProps> = ({ date, onChange }) => {

    const [show, setShow] = useState(false);

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        onChange(currentDate);
    };


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
            <View style={[styles.inputContainer, { flex: 1 }]} >
                <Text style={styles.inputTitle}>Data</Text>
                <TouchableOpacity style={[styles.input, styles.dateInput]} onPress={() => setShow(true)}>
                    <Text style={{ fontSize: 15 }} >{moment(date).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>

                {show && (
                    <DateTimePicker
                        onChange={onChangeDate}
                        value={date}
                        mode={'date'}
                    />
                )}
            </View>
        </View>
    );

}

export default DatePicker;