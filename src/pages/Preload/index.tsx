import React, { useContext, useEffect } from 'react';
import styles from './styles';
import { View, ActivityIndicator } from 'react-native';
import Logo from '../../assets/logo.svg';
import AsyncStorage from '@react-native-community/async-storage';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import api from '../../services/api';
import { catchErrorMessage, setMomentLocale } from '../../services/utils';

export default function Preload() {
    const { dispatch }: any = useContext(UserContext);
    const navigation = useNavigation();

    useEffect(() => {
        setMomentLocale();
        const checkToken = async () => {

            const config = await AsyncStorage.getItem('appConfig')
            const { token } = config ? JSON.parse(config) : '';

            try {
                if (token) {
                    const response = await api.checkToken(token);
                    if (response.status === 200) {

                        //TODO: ADD REDUCER AND CONTEXT API
                        dispatch({
                            type: 'setName',
                            payload: {
                                name: response.name
                            }
                        });

                        showMessage({
                            message: 'Welcome back!',
                            description: 'Logged in success.',
                            type: "success",
                            duration: 2300
                        })

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
            } catch (error) {
                catchErrorMessage(error);
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