
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        marginTop: -35,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-between',
        padding: 40
    },
    body: {
        // paddingStart: 24,
    },
    inputContainer: {
        marginTop: 10,
        marginBottom: 8,
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
    attachmentContainer: {
        marginTop: 10,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    attachmentImageContainer: {
        flex: 1,
        marginTop: 10,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    attachmentImage: {
        height: 220,
        width: 200,
        flex: 1,
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede',
    },
    attachmentInput: {
        flex: 1,
        height: 60,
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#dedede',
        // flexDirection: 'row',
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10
    },
    button: {
        flex: 1,
        height: 45,
        marginHorizontal: 10,
        // width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e4f9',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'Roboto_500Medium',
        color: '#fff',
    }
})

export default styles