import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, Button, TouchableOpacity, Platform } from 'react-native'
import PageHeader from '../../components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text'
import { useNavigation } from '@react-navigation/native';
import TransactionDatePicker from '../../components/TransactionDatePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import PaidButton from '../../components/PaidButton';


const AddTransacion = () => {

    const currentDate = new Date();

    const [amount, setAmount] = useState('');
    const [paid, setPaid] = useState(true);

    const [date, setDate] = useState(currentDate);
    const [dueDate, setDueDate] = useState(currentDate);

    const navigation = useNavigation();

    function handleBack() {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            < PageHeader title={'Add Transaction'} />
            <View style={styles.content} >

                <View style={styles.body} >
                    <View style={styles.inputContainer} >
                        <Text style={styles.inputTitle} >Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                        />
                    </View>

                    <View style={styles.inputContainer} >
                        <Text style={styles.inputTitle} >Category</Text>
                        <DropDownPicker
                            items={[
                                { label: 'Supermarket', value: 'uk' },
                                { label: 'Provider', value: 'france' },
                                { label: 'Salary', value: 'sl' },
                            ]}
                            defaultValue={'uk'}
                            containerStyle={{ height: 40 }}
                            style={{ backgroundColor: '#fafafa' }}

                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{ backgroundColor: '#fafafa', flex: 1 }}
                            onChangeItem={item => console.log(item)}
                        />
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Category"
                        /> */}


                        {/* https://medium.com/swlh/how-to-add-a-dropdown-list-to-react-native-2441d6fe40c2 */}

                    </View>

                    <View style={styles.inputContainer} >
                        <Text style={styles.inputTitle}>Amount</Text>
                        <TextInputMask
                            type={'money'}
                            style={styles.input}
                            placeholder="Amount"
                            value={amount}
                            onChangeText={(text) => setAmount(text)}

                        />
                    </View>

                    <PaidButton paid={paid} onChange={setPaid} />

                    <TransactionDatePicker paid={paid} date={date} onChange={setDate} dueDate={dueDate} onChangeDue={setDueDate} />
                    
                    <View style={styles.inputContainer} >
                        <TouchableOpacity
                            style={styles.attachmentInput}
                        >
                            <AntDesign name="scan1" size={24} color="black" />
                            <Text style={styles.attachmentInputText} >Add attachment by camera</Text>

                        </TouchableOpacity>
                    </View>


                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={() => { handleBack() }} >
                        <Text style={[styles.buttonText, { color: '#a8a4d3' }]} >Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#4643d3' }]} onPress={() => { }} >
                        <Text style={styles.buttonText} >Add</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        marginTop: -35,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-between',
        padding: 40
    },
    body: {
        // paddingStart: 24,
    },
    inputContainer: {
        marginTop: 10,
        marginBottom: 8
    },
    input: {
        height: 45,
        backgroundColor: '#fff',
        fontSize: 16,
        // color: '#b9b9b9',
        paddingLeft: 15,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede'
    },
    inputTitle: {
        color: '#b9b9b9',
        fontSize: 12,
        fontFamily: 'Roboto_500Medium'
    },
    attachmentInput: {
        height: 60,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    attachmentInputIcon: {
    },
    attachmentInputText: {
        fontFamily: 'Roboto_500Medium',
        fontSize: 12,
        paddingHorizontal: 10
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    button: {
        flex: 1,
        height: 45,
        marginHorizontal: 10,
        // width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e4f9',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'Roboto_500Medium',
        color: '#fff',
    }
})

export default AddTransacion;

