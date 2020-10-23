import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        height: 30,
    },
    item: {
        marginRight: 5,
        marginTop: 1,
        borderRadius: 25,
        backgroundColor: '#6664d4',
        alignItems: 'center',
        justifyContent: 'center'
    },
    active: {
        backgroundColor: '#43b864'
    },
    text: {
        marginHorizontal: 20,
        color: '#fff',
        fontFamily: 'Roboto_500Medium'
    }
});

export default styles;