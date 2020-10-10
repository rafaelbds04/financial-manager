import { StyleSheet } from 'react-native'; 

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 10,
        marginBottom: 8
    },
    inputTitle: {
        color: '#b9b9b9',
        fontSize: 12,
        fontFamily: 'Roboto_500Medium'
    },
    optionContainer: {
        marginTop: 2,
        height: 35,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    optionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    optionTitle: {
        fontFamily: 'Roboto_700Bold',
        color: '#b9b9b9',
        fontSize: 13
    },
    active: {
        borderRadius: 10,
        color: '#fff',
        backgroundColor: '#4643d3'
    },
    textActive: {
        color: '#fff',
    },
});

export default styles;