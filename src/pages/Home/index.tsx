import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AreaChart, LineChart, StackedAreaChart, Grid } from 'react-native-svg-charts'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';


import * as shape from 'd3-shape'

import SlidingUpPanel from 'rn-sliding-up-panel';
import api from '../../services/api';
import { catchErrorMessage } from '../../services/utils';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { UserContext } from '../../contexts/UserContext';
import { IState } from '../../reducers/UserReducer';
import moment from 'moment';
import { Category, CategoryType } from '../AddTransaction';
import TransactionCard from '../../components/TransactionCard';
import TransactionCardShimmer from '../../components/TransactionCardShimmer';

/**
 * Colors
 * primary #4643d3
 * primary second #6664d4
 * Fullbg #ebecf2
 * White labels #fff
 * Reverse #f58218
 * Black #1e1e1e
 * 
 * Revenue: #37b55a
 * Expenses: #4643d3
 * 
 */

export interface Transactions {
    id: number
    name: string
    transactionType: CategoryType
    amount: number
    transactionDate: Date
    dueDate?: Date
    paid: boolean
    category: Category
}

export default function Home() {

    const navigation = useNavigation();
    const currentDate = new Date()
    const currentHour = currentDate.getHours();
    const { state: { name } }: any = useContext(UserContext);

    function handleNavigateTo(scrren: string) {
        navigation.navigate(scrren);
    }

    const { height, width } = Dimensions.get('window');

    const data = [50, 10, 40, 95, 10, 60, 85, 91, 35, 53, 40, 24]

    const [summary, setSummary] = useState([
        {
            title: 'Revenues',
            value: 17200,
            valueVisible: false,
            chartsData: [] as any,
            key: '1',
            color: '#37b55a'
        },
        {
            title: 'Expenses',
            value: 100,
            valueVisible: false,
            chartsData: [] as any,
            key: '2',
            color: '#4643d3'
        },
        {
            title: 'Due',
            value: 100,
            valueVisible: false,
            chartsData: [] as any,
            key: '3',
            color: '#f58218'
        },
        {
            title: 'Overdue',
            value: 100,
            valueVisible: false,
            chartsData: [] as any,
            key: '4',
            color: '#ff344c'
        }
    ]);


    const shortcuts = [
        {
            name: 'Add \nExpense',
            action: 'AddTransaction',
            icon: 'minussquareo',
            key: '1',
        },
        {
            name: 'Add \nRevenue',
            action: 'AddTransaction',
            icon: 'plussquareo',
            key: '2'
        },
        {
            name: 'To \nReceipt',
            action: 'AddTransaction',
            icon: 'menufold',
            key: '3'
        },
        {
            name: 'Accounts',
            action: 'AddTransaction',
            icon: 'creditcard',
            key: '4'
        },

    ];


    const [transactions, setTransactions] = useState<Transactions[] | null>();
    const transactionsAA = [
        {
            key: '1',
            title: 'Revenue',
            amount: 1200.00,
            credit: true
        },
        {
            key: '2',
            title: 'Provider payment',
            category: 0,
            amount: 160.00,
            credit: false
        },
        {
            key: '3',
            title: 'Provider payment',
            amount: 246.00,
            credit: false
        },
        {
            key: '4',
            title: 'Supermarket',
            amount: 128.00,
            credit: false
        },
        {
            key: '5',
            title: 'Supermarket',
            amount: 480.00,
            credit: false
        }
    ]

    useEffect(() => {
        (async () => {
            fetchSummary();
            fetchLastTransactions();
        })()
    }, [])

    function getGreeting() {
        return currentHour < 12 ? 'Good Morning' :
            (currentHour < 18 ? 'Good Afternoon' : 'Good Night')
    }

    async function fetchSummary() {
        try {
            const getSummary = await api.getSumaryStats();
            if (getSummary.error) throw getSummary.message;
            const currentSummary = [...summary];
            currentSummary[0] = { ...currentSummary[0], value: getSummary.revenue, valueVisible: true }; //Revenues
            currentSummary[1] = { ...currentSummary[1], value: getSummary.expense, valueVisible: true }; //Expenses
            currentSummary[2] = { ...currentSummary[2], value: getSummary.due, valueVisible: true }; //Due
            currentSummary[3] = { ...currentSummary[3], value: getSummary.overDue, valueVisible: true }; //Over Due

            setSummary(currentSummary);
        } catch (error) {
            catchErrorMessage(error);
        }
    }

    async function fetchLastTransactions() {
        try {
            const response = await api.getLastTransactions();
            if (response.error) throw response.message
            //Sorting by date
            const data = response.data.sort((a, b) => {
                return Number(moment(b.transactionDate)) - Number(moment(a.transactionDate))
            })

            setTransactions(data);
            mountCharts(data);
        } catch (error) {
            catchErrorMessage(error);
        }
    }
    //TODO CHANGE TO SCROLL VIEW
    function mountCharts(data: Transactions[]) {
        const revenues = data.filter((item) => item.transactionType == CategoryType.REVENUE).map((item) => item.amount)
        const expenses = data.filter((item) => item.transactionType == CategoryType.EXPENSE).map((item) => item.amount)
        const due = data.filter((item) => item.transactionType == CategoryType.EXPENSE && item.paid == false).map((item) => item.amount)
        const overDue = data.filter((item) => item.transactionType == CategoryType.EXPENSE && item.paid == false && moment(item.dueDate).format() < moment().format()).map((item) => item.amount)
        const currentSummary = [...summary];
        currentSummary[0].chartsData = revenues ? revenues : [0, 0];
        currentSummary[1].chartsData = expenses ? expenses : [0, 0];
        currentSummary[2].chartsData = due ? due : [0, 0];
        currentSummary[3].chartsData = overDue ? overDue : [0, 0];

        setSummary(currentSummary);
    }



    const [dragRange, setDragRange] = useState({
        top: height - 105,
        bottom: height - 480
    });

    const _draggedValue = new Animated.Value(180);
    const modalRef = useRef(null);


    return (
        <><View style={styles.container}>

            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{getGreeting()},</Text>
                    <Text style={styles.subtitle}>{name}!</Text>
                </View>
                <View>
                    <Image style={styles.profileImage}
                        source={{ uri: 'https://images.pexels.com/photos/936229/pexels-photo-936229.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260' }} />
                </View>
            </View>

            <View style={styles.summaryContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={summary}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => {
                        return (
                            <View style={[styles.summaryCard,
                            { backgroundColor: item.color }]}>

                                <View>

                                    <Text style={styles.summaryCardSubtitle}>
                                        {item.title}</Text>

                                    <ShimmerPlaceholder
                                        height={20}
                                        width={60}
                                        shimmerStyle={{ borderRadius: 10, marginTop: 5 }}
                                        visible={item.valueVisible}
                                    >
                                        <Text style={styles.summaryCardTitle}>
                                                R${item.value}</Text>
                                    </ShimmerPlaceholder>

                                </View>
                                <ShimmerPlaceholder
                                    height={60}
                                    width={185}
                                    shimmerStyle={{ borderRadius: 10, marginTop: 20 }}
                                    visible={(item.chartsData.length > 0)}
                                >
                                    <LineChart
                                        style={{ height: 80 }}
                                        data={data}
                                        svg={{ stroke: 'rgb(255, 255, 255)', strokeWidth: 2 }}
                                        curve={shape.curveNatural}
                                        contentInset={{ top: 20, bottom: 2 }}
                                    >
                                    </LineChart>
                                </ShimmerPlaceholder>
                            </View>
                        );
                    } } />
            </View>

            <LinearGradient
                colors={['#fefefe', '#efefef', '#fcfcfc']}
                style={{ paddingBottom: 30 }}
            >
                <Text style={styles.shortcutsContainerTitle}>Shortcuts</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={shortcuts}
                    style={{ paddingHorizontal: 10 }}
                    renderItem={({ item }) => {
                        return (

                            <TouchableOpacity
                                onPress={() => { handleNavigateTo(item.action); } }
                                style={styles.shortcutsCardContainer}
                            >
                                <View>
                                    <AntDesign name={item.icon} size={24} color='#4543d3' />
                                </View>

                                <Text style={styles.shortcutsCardTtile}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    } } />

            </LinearGradient>
        </View>

            <View style={{ flex: 1 }}>

                <SlidingUpPanel
                    ref={modalRef}
                    draggableRange={dragRange}
                    animatedValue={_draggedValue}
                    backdropOpacity={0}
                    snappingPoints={[400]}
                    height={height + 20}
                    friction={0.9}
                >

                    <View style={styles.slidingPanel}>
                        <View style={styles.slidingPanelBottom}></View>
                        <View style={styles.slidingPanelHeader}>
                            <Text style={styles.slidingPanelHeaderTitle}>Transactions</Text>
                            <Text style={styles.slidingPanelHeaderOptions}>All</Text>
                        </View>
                        <View style={styles.slidingPanelContent}>
                            {transactions ? (<>
                                <FlatList
                                    data={transactions?.slice(0, 10)}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => {
                                        return (
                                            <TransactionCard data={item} />
                                        );
                                    } } /></>) : (<>
                                        <TransactionCardShimmer />
                                        <TransactionCardShimmer />
                                        <TransactionCardShimmer />
                                        <TransactionCardShimmer />
                                    </>)}


                        </View>

                    </View>

                </SlidingUpPanel>

            </View></>

        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 32,
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
    },
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
    shortcutsContainerTitle: {
        padding: 20,
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
        padding: 20
    }
});