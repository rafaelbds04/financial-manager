import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    header: {
        paddingTop: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 21,
        color: '#1e1e1e',
        fontFamily: 'Roboto_700Bold'
    },
    subtitle: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 19,
        color: '#1e1e1e',
        opacity: 0.6
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 40
    },
    summaryContainer: {
        paddingTop: 10,
        // marginBottom: 10
    },
    shortcutsContainerTitle: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 22,
        fontFamily: 'Roboto_700Bold',
        color: '#1e1e1e'
    },
    shortcutsCardContainer: {
        marginHorizontal: 10,
        backgroundColor: '#fff',
        height: 100,
        width: 88,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingStart: 10,
        paddingVertical: 15,
        borderRadius: 15,
    },
    shortcutsCardTtile: {
        paddingTop: 5,
        fontSize: 13,
        fontFamily: 'Roboto_700Bold',
        color: '#1e1e1e'
    },
    slidingPanel: {
        flex: 1,
        backgroundColor: '#4643d3',
        borderRadius: 50,
    },
    slidingPanelBottom: {
        marginTop: 10,
        width: 50,
        height: 6,
        alignSelf: 'center',
        borderRadius: 99,
        backgroundColor: '#6664d4'
    },
    slidingPanelHeader: {
        paddingTop: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    slidingPanelHeaderTitle: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 18,
        color: '#fff'
    },
    slidingPanelHeaderOptions: {
        fontFamily: 'Roboto_300Light',
        fontSize: 18,
        color: '#fff'
    },
    slidingPanelContent: {
        padding: 20,
    },
});

export default styles;