import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    contaier: {
        flex: 1,
        marginTop: -35
    },
    scanContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginBottom: 30,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    scanButton: {
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