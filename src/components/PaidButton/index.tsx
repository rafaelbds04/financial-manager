import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface PaidButtonProps {
    paid: boolean,
    onChange: Function,
}


const PaidButton: React.FC<PaidButtonProps> = ({ paid, onChange }) => {

    return (
        <View style={styles.inputContainer} >
            <Text style={styles.inputTitle}>Paid</Text>
            <View style={styles.optionContainer}>
                <TouchableOpacity
                    style={[styles.optionButton, paid && styles.active]}
                    onPress={() => onChange(true)}
                >
                    <Text style={[styles.optionTitle, paid && styles.textActive]} >Paid</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionButton, !paid && styles.active]}
                    onPress={() => onChange(false)}

                >
                    <Text style={[styles.optionTitle, !paid && styles.textActive]} >Not Paid</Text>
                </TouchableOpacity>

            </View>
        </View>
    );

}

export default PaidButton;