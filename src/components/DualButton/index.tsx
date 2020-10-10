import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface DualButtonProps {
    value: boolean,
    onChange: Function,
    sectionName: string
    btn1Name: string,
    btn2Name: string
}

const DualButton: React.FC<DualButtonProps> = ({ value, onChange, sectionName, btn1Name, btn2Name }) => {
    return (
        <View style={styles.inputContainer} >
            <Text style={styles.inputTitle}>{sectionName}</Text>
            <View style={styles.optionContainer}>
                <TouchableOpacity
                    style={[styles.optionButton, value && styles.active]}
                    onPress={() => onChange(true)}
                >
                    <Text style={[styles.optionTitle, value && styles.textActive]} >{btn1Name}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionButton, !value && styles.active]}
                    onPress={() => onChange(false)}

                >
                    <Text style={[styles.optionTitle, !value && styles.textActive]} >{btn2Name}</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

export default DualButton;