import React from 'react';
import { View, Text, } from 'react-native';
import styles from './styles';
import { TextInputMask } from 'react-native-masked-text';

interface CurrencyInputProps {
    value: string,
    onChangeAmount: ((text: string) => void)
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ onChangeAmount, value }) => {
    return (
        <View style={styles.inputContainer} >
            <Text style={styles.inputTitle}>Valor</Text>
            <TextInputMask
                type={'money'}
                style={styles.input}
                placeholder="Valor"
                value={value}
                onChangeText={(text) => onChangeAmount(text)}
            />
        </View>
    );
}

export default CurrencyInput;