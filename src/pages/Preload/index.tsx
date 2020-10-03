import React, { useEffect } from 'react';
import styles from './styles';
import { View, ActivityIndicator } from 'react-native';
import Logo from '../../assets/logo.svg';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';

export default function Preload() {

    const navigation = useNavigation();

    useEffect(() => {
        const checkToken = async () => {
            
            const config = await AsyncStorage.getItem('appConfig')
            const { token } = config ? JSON.parse(config) : '';
            
            if (token) {
                const request = await api.checkToken(token);
                if (request.status === 200) {
                    //TODO: ADD REDUCER AND CONTEXT API

                    navigation.reset({
                        routes: [{ name: 'Home' }]
                    })

                } else {
                    navigation.reset({
                        routes: [{ name: 'SingIn' }]
                    })
                }

            } else {
                navigation.reset({
                    routes: [{ name: 'SingIn' }]
                })
            }
        }
        checkToken();



    }, []);

    return (
        <View style={styles.container}>
            <Logo width={120} height={120} fill='#37b55a' style={{ marginBottom: 30 }} />
            <ActivityIndicator size="large" color='#fff' />
        </View>
    )

}