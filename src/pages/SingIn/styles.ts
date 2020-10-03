import { StyleSheet } from 'react-native'
import { Roboto_700Bold } from '@expo-google-fonts/roboto';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4643d3'
    },
    inputArea: {
        flexDirection: 'column',
        padding: 30
    },
    button: {
        width: 260,
        height: 45,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#37b55a',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'Roboto_700Bold',
        color: '#fff',
        fontSize: 18
    }
    
})

export default styles;