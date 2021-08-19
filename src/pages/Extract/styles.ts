import { StyleSheet } from 'react-native'
//'#6664d4'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 15,
        backgroundColor: '#4643d3'
    },
    header: {
        paddingTop: 30,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerTitle: {
        color: '#fff',
        fontFamily: 'Roboto_700Bold',
        fontSize: 18
    },
    topContent: {
        marginTop: 50,
    },
    selectionList: {
        marginTop: 25,
        height: 30,
        paddingLeft: 20
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        // justifyContent: 'space-between',
        marginTop: 10,
    },
    modalFooter: {
        marginBottom: 20
    },
    button: {
        height: 45,
        marginHorizontal: 10,
        // width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#37b55a',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'Roboto_500Medium',
        color: '#fff',
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(70, 67, 211, 0.8)',
        paddingTop: 20,
        paddingHorizontal: 20,
        alignContent: 'space-between'
    },
    confirmModalFooter: {
        flexDirection: 'row',
    },
    inputContainer: {
        marginHorizontal: 20,
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
})

export default styles;