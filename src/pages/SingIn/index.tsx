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
        async function getMail() {
            const config = await AsyncStorage.getItem('appConfig')
            const { lastLoggedMail } = config ? JSON.parse(config) : '';
            if (lastLoggedMail) setEmailField(lastLoggedMail);
        }
        getMail();
    }, [])


    const handleLoginClick = async () => {
        if (!(emailField && passwordField)) return alert('Fill the fields')

        const response = await api.singIn(emailField, passwordField);
        if (response.token) {

            const toAddConfig = JSON.stringify({
                 token: response.token, 
                 lastLoggedMail: emailField 
                })
            await AsyncStorage.setItem('appConfig', toAddConfig)

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
                type='emailAddress' autoCapitalize='none'
                />
                <SingInInput value={passwordField} onChangeText={(t) => setPasswordField(t)} placeholder='Password'
                    keyboardType='number-pad' type='password' isPassword={true} autoCapitalize='none' />

                <TouchableOpacity style={styles.button} onPress={() => { handleLoginClick() }} >
                    <Text style={styles.buttonText} >Login</Text>
                </TouchableOpacity>


            </View>
        </View>
    )

}