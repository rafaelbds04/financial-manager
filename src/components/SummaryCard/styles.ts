import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    summaryCard: {
        padding: 20,
        height: 160,
        width: 220,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    summaryCardTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Roboto_700Bold'
    },
    summaryCardSubtitle: {
        color: '#fff',
        marginTop: -3,
        fontSize: 15,
        fontFamily: 'Roboto_400Regular',
        opacity: 0.6
    },
});

export default styles;