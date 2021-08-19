import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    contaier: {
        flex: 1,
        marginTop: -75
    },
    inputContainer: {
        marginTop: 10,
        marginBottom: 8
    },
    inputTitle: {
        color: '#b9b9b9',
        fontSize: 12,
        fontFamily: 'Roboto_500Medium'
    },
    attachmentInput: {
        height: 60,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    attachmentInputIcon: {
    },
    attachmentInputText: {
        fontFamily: 'Roboto_500Medium',
        fontSize: 12,
        paddingHorizontal: 10
    },
    footer: {
        flex: 1,
        marginBottom: 30,
        alignSelf: 'flex-end',
        alignItems: 'center',
        // backgroundColor: 'red',

        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // alignItems: 'center'
    },
    previewFooter: {
        flex: 0.15,
        backgroundColor: '#4643d3',
        alignSelf: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
        button: {
        flex: 1,
        height: 45,
        marginHorizontal: 10,
        // width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff344c',
        borderRadius: 10
    },
    captureButton: {
        flex: 1,
        height: 60,
        marginHorizontal: 20,
        backgroundColor: '#4643d3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'Roboto_500Medium',
        color: '#fff',
    }
});

export default styles;