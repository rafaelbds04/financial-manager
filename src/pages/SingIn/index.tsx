import React, { useState, useEffect } from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity } from 'react-native';
import Api from '../../services/api';

import Logo from '../../assets/logo.svg';
import SingInInput from '../../components/SingInInput';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SingIn() {

    const navigation = useNavigation();

    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    useEffect(() => {
        async () => {
            const userEmail = await AsyncStorage.getItem('userEmail')
            if (userEmail) setEmailField(userEmail);
        }
    }, [])


    const handleLoginClick = async () => {
        if (!(emailField && passwordField)) return alert('Fill the fields')

        const response = await api.singIn(emailField, passwordField);
        if (response.token) {
            await AsyncStorage.setItem('token', response.token)
            await AsyncStorage.setItem('userEmail', emailField)

            //TODO: ADD REDUCER AND CONTEXT API

            navigation.reset({
                routes: [{ name: 'Home' }]
            })
        } else {
            alert(response.message);
        }
    }


    return (
        <View style={styles.container}>
            <Logo width={120} height={120} fill='#37b55a' style={{ marginBottom: 30 }} />
            <View style={styles.inputArea} >
                <SingInInput value={emailField} onChangeText={(t) => setEmailField(t)} placeholder='Email' 
                type='emailAddress'
                />
                <SingInInput value={passwordField} onChangeText={(t) => setPasswordField(t)} placeholder='Password'
                    keyboardType='number-pad' type='password' isPassword={true} />

                <TouchableOpacity style={styles.button} onPress={() => { handleLoginClick() }} >
                    <Text style={styles.buttonText} >Login</Text>
                </TouchableOpacity>


            </View>
        </View>
    )

}