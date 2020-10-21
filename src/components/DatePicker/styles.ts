import { StyleSheet } from 'react-native'; 

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 10,
        marginBottom: 8
    },
    input: {
        height: 45,
        backgroundColor: '#fff',
        fontSize: 16,
        // color: '#b9b9b9',
        paddingLeft: 15,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede'
    },
    inputTitle: {
        color: '#b9b9b9',
        fontSize: 12,
        fontFamily: 'Roboto_500Medium'
    },
    dateInput: {
        justifyContent: 'center',
    }
});

export default styles;