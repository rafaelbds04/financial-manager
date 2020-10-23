import { StyleSheet } from 'react-native'
import { Roboto_700Bold } from '@expo-google-fonts/roboto';
//'#6664d4'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 30,
        backgroundColor: '#4643d3'
    },
    header: {
        paddingTop: 30,
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
    selectionList:{
        marginTop: 20,
        height: 30
    },
    content: {
        flex: 1,
        // justifyContent: 'space-between',
        marginTop: 10
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