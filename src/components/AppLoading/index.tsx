import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';
import Logo from '../../assets/logo.svg';

const AppLoading: React.FC = () => {
    return (
        <View style={styles.container}>
            <Logo width={120} height={120} fill='#37b55a' style={{ marginBottom: 30 }} />
            <ActivityIndicator size="large" color='#fff' />
          </View>
    );
}

export default AppLoading;