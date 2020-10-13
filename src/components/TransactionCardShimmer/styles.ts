import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    transactionItemCard: {
        justifyContent: 'space-between',
        marginTop: 20,
        height: 45,
        borderRadius: 5,
        flexDirection: 'row',
    },
    transactionItemIcon: {
        backgroundColor: '#fff',
        borderRadius: 99,
        height: 42,
        width: 42,
        alignItems: 'center',
        justifyContent: 'center'
    },
    transactionItemTitle: {
        fontFamily: 'Roboto_400Regular',
        color: '#fff',
        fontSize: 17,
    },
    transactionItemSubtitle: {
        fontFamily: 'Roboto_300Light',
        color: '#fff',
    },
    transactionItemValue: {
        fontFamily: 'Roboto_700Bold',
        color: '#fff',
        fontSize: 18,
    }
});

export default styles;