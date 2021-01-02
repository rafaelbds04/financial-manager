import React, { ReactNode, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface PageHedaerProps {
    title: string
    additionalIcon?: ReactNode
}

const PageHeader: React.FC<PageHedaerProps> = ({ title, additionalIcon }) => {

    const { goBack } = useNavigation();

    function handleBack() {
        goBack();
    }


    return (
        <View style={styles.container} >
            <View style={styles.topBar}>
                <TouchableOpacity onPress={
                    () => handleBack()
                }>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title} >{title}</Text>

                <View>{additionalIcon}</View>
            </View>

        </View >
    );

}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        paddingTop: 60,
        backgroundColor: '#4643d3',
        height: 160
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        color: '#fff',
        fontFamily: 'Roboto_700Bold',
        fontSize: 18
    }
});

export default PageHeader;