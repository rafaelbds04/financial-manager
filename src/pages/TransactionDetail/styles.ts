import { StyleSheet } from 'react-native'
import { Roboto_700Bold } from '@expo-google-fonts/roboto';
//'#6664d4'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#4643d3'
    },
    header: {
        paddingTop: 30,
    },
    topContent: {
        marginTop: 50,
    },
    title: {
        marginTop: 15,
        fontSize: 24,
        fontFamily: 'Roboto_700Bold',
        color: '#fff'
    },
    content: {
        flex: 1,
        justifyContent: 'space-between'
    },
    horizontalRule: {
        marginVertical: 20,
        // flexDirection: 'row',
        // width: 300,
        height: 0.3,
        // alignSelf: 'center',
        borderRadius: 99,
        backgroundColor: '#fff'
    },
    description: {
        marginTop: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        color: '#fff',
        fontSize: 17
    },
    value: {
        color: '#fff',
        fontFamily: 'Roboto_700Bold',
        fontSize: 17
    },
    amount: {
        color: '#fff',
        fontFamily: 'Roboto_700Bold',
        fontSize: 26
    },
    actionsContent: {
        marginTop: 50,
    },
    attachmentsButton: {
        marginTop: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        height: 45,
        backgroundColor: '#6664d4',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10
    },
    attachmentsText: {
        fontFamily: 'Roboto_700Bold',
        color: '#fff',
        fontSize: 18
    },
    footer: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        marginBottom: 20
    },
    button: {
        flex: 1,
        height: 45,
        marginHorizontal: 10,
        // width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ec5757',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'Roboto_500Medium',
        color: '#fff',
    },
    shimmerTitle: {
        flexDirection: 'row',
        marginTop: 50,
        height: 41
    },
    confirmModal: {
        flex: 1,
        backgroundColor: 'rgba(70, 67, 211, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60
    },
    confirmModalFooter: {
        flexDirection: 'row',
    },
})

export default styles;