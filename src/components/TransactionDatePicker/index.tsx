import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import styles from './styles';

interface TransactionDatePickerProps {
    paid: boolean,
    date: Date,
    onChange: Function,
    dueDate: Date,
    onChangeDue: Function
}


const TransactionDatePicker: React.FC<TransactionDatePickerProps> = ({ paid, date, onChange, dueDate, onChangeDue }) => {

    const [show, setShow] = useState(false);
    const [dueShow, setDueShow] = useState(false);

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        onChange(currentDate);
    };

    const onChangeDueDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dueDate;
        setDueShow(Platform.OS === 'ios');
        onChangeDue(currentDate);
    };


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
            <View style={[styles.inputContainer, { flex: 1 }]} >
                <Text style={styles.inputTitle}>Date</Text>
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

            {!paid && (<View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]} >
                <Text style={styles.inputTitle}>Due Date</Text>
                <TouchableOpacity style={[styles.input, styles.dateInput]} onPress={() => setDueShow(true)}>
                    <Text style={{ fontSize: 15 }} >{moment(dueDate).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>

                {dueShow && (
                    <DateTimePicker
                        onChange={onChangeDueDate}
                        value={dueDate}
                        mode={'date'}
                        minimumDate={date}
                    />
                )}
            </View>)}

        </View>
    );

}

export default TransactionDatePicker;