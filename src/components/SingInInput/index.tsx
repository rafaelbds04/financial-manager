import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SingInInputProps {
    placeholder: string,
    value: string
    onChangeText: ((text: string) => void) | undefined
    keyboardType?: any
    type?: any
    isPassword?: boolean | undefined
}

const SingInInput: React.FC<SingInInputProps> = ({ placeholder, value, onChangeText, keyboardType, type, isPassword }) => {

    return (
        <View style={styles.inputContainer} >
            <TextInput
                placeholder={placeholder}
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                keyboardType={keyboardType}
                textContentType={type}
                secureTextEntry={isPassword}
            />
        </View>

    );

}

const styles = StyleSheet.create({
    inputContainer: {
        padding: 5
    },
    input: {
        width: 260,
        height: 45,
        backgroundColor: '#fff',
        fontSize: 16,
        // color: '#b9b9b9',
        paddingLeft: 15,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede'
    },
});

export default SingInInput;