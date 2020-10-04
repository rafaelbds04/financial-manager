import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, Button, TouchableOpacity, Image, ScrollView } from 'react-native'
import PageHeader from '../../components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text'
import { useNavigation, useRoute } from '@react-navigation/native';
import TransactionDatePicker from '../../components/TransactionDatePicker';
import PaidButton from '../../components/PaidButton';
import CategorySelector from '../../components/CategorySelector'

interface Params {
    attachmentImage?: string | any;
}

const AddTransaction = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;

    const [capturedAttachment, setCapturedAttachment] = useState<string>(null);


    useEffect(() => {
        if (routeParams?.attachmentImage) {
            setCapturedAttachment(routeParams?.attachmentImage);
        }
    }, [routeParams?.attachmentImage]);

    const currentDate = new Date();

    const [amount, setAmount] = useState('');
    const [paid, setPaid] = useState(true);

    const [date, setDate] = useState(currentDate);
    const [dueDate, setDueDate] = useState(currentDate);

    const categoriesItems =
        [
            { label: 'Supermarket', value: 'uk' },
            { label: 'Provider', value: 'france' },
            { label: 'Salary', value: 'sl' },
        ]

    function handleBack() {
        navigation.goBack();
    }

    function handleAddAttachmentFromCamera() {
        navigation.navigate('AttacmentCamera');
    }

    return (
        <View style={styles.container}>


            < PageHeader title={'Add Transaction'} />

            <View style={styles.content} >
                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}  >

                    <View style={styles.inputContainer} >
                        <Text style={styles.inputTitle} >Name {}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                        />
                    </View>

                    <CategorySelector
                        items={categoriesItems}
                        onChangeItem={(item: any) => console.log(item)}
                        defaultValue='uk'
                    />

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

                    <Text style={styles.inputTitle} >Attachments</Text>
                    <View style={styles.attachmentContainer} >

                        <TouchableOpacity
                            style={styles.attachmentInput}
                            onPress={() => { handleAddAttachmentFromCamera() }}
                        >
                            <AntDesign name="camerao" size={24} color="black" />
                            <Text style={styles.attachmentInputText} >From camera</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.attachmentInput}
                            onPress={() => {

                            }}
                        >
                            <AntDesign name="scan1" size={24} color="black" />
                            <Text style={styles.attachmentInputText} >Read recip code</Text>

                        </TouchableOpacity> 
                    </View>

                    {capturedAttachment ? (
                        <View style={styles.attachmentImageContainer}>
                            <Image style={styles.attachmentImage}
                                source={{ uri: capturedAttachment }} 
                                />
                                
                                
                        </View>
                    ) : (<></>)}

                </ScrollView>


                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={() => { handleBack() }} >
                        <Text style={[styles.buttonText, { color: '#a8a4d3' }]} >Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button,
                    { backgroundColor: '#4643d3' }]} onPress={() => { }} >
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
        marginBottom: 8,
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
    attachmentContainer: {
        marginTop: 10,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    attachmentImageContainer: {
        marginTop: 10,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    attachmentImage: {
        height: 220,
        flex: 1,
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede',
    },
    attachmentInput: {
        flex: 1,
        height: 60,
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede',
        // flexDirection: 'row',
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
        alignItems: 'center',
        marginTop: 10
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

export default AddTransaction;

