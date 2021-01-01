import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import styles from './styles';

interface DualDatePickerProps {
    onChangeFromDate: Function,
    onChangeToDate: Function,
    fromDate: Date,
    toDate: Date,
}

const DualDatePicker: React.FC<DualDatePickerProps> = ({ onChangeFromDate, onChangeToDate, fromDate,  toDate}) => {

    const [show, setShow] = useState(false);
    const [toShow, setToShow] = useState(false);

    const onChangeDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || fromDate;
        setShow(Platform.OS === 'ios');
        onChangeFromDate(currentDate);
        if (currentDate > toDate) onChangeToDate(currentDate)
        onChangeFromDate(moment(currentDate).startOf('day').toDate())
    };

    const onChangeSecondDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || toDate;
        setToShow(Platform.OS === 'ios');
        onChangeToDate(currentDate);
        onChangeToDate(moment(currentDate).endOf('day').toDate())
    };


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
            <View style={[styles.inputContainer, { flex: 1 }]} >
                <Text style={styles.inputTitle}>Inicial</Text>
                <TouchableOpacity style={[styles.input, styles.dateInput]} onPress={() => setShow(true)}>
                    <Text style={{ fontSize: 15 }} >{moment(fromDate).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>

                {show && (
                    <DateTimePicker
                        onChange={onChangeDate}
                        value={fromDate}
                        mode={'date'}
                    />
                )}
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]} >
                <Text style={styles.inputTitle}>Final</Text>
                <TouchableOpacity style={[styles.input, styles.dateInput]} onPress={() => setToShow(true)}>
                    <Text style={{ fontSize: 15 }} >{moment(toDate).format('DD/MM/YYYY')}</Text>
                </TouchableOpacity>

                {toShow && (
                    <DateTimePicker
                        onChange={onChangeSecondDate}
                        value={toDate}
                        mode={'date'}
                        minimumDate={fromDate}
                    />
                )}
            </View>

        </View>
    );

}

export default DualDatePicker;