import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

import SlidingUpPanel from 'rn-sliding-up-panel';
import api from '../../services/api';
import { catchErrorMessage } from '../../services/utils';
import { UserContext } from '../../contexts/UserContext';
import moment from 'moment';
import { Category, CategoryType } from '../AddTransaction';
import TransactionCard from '../../components/TransactionCard';
import TransactionCardShimmer from '../../components/TransactionCardShimmer';
import SummaryCard from '../../components/SummaryCard';

import styles from './styles';
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

interface SummaryValue {
    revenue?: number,
    expense?: number,
    due?: number,
    overDue?: number
}

interface chartsData {
    revenue: Number[]
    expense: Number[]
    due: Number[],
    overDue: Number[]
}

export default function Home() {

    const navigation = useNavigation();
    const currentDate = new Date()
    const currentHour = currentDate.getHours();
    const { state: { name } }: any = useContext(UserContext);

    const { height, width } = Dimensions.get('window');

    const [summaryValue, setSummaryValue] = useState<SummaryValue>({})

    const [chartsData, setChartsData] = useState<chartsData>({
        due: [], expense: [], overDue: [], revenue: []
    })

    const [transactions, setTransactions] = useState<Transactions[] | null>();

    const [dragRange, setDragRange] = useState({
        top: height - 105,
        bottom: height - 480
    });

    const _draggedValue = new Animated.Value(180);
    const modalRef = useRef(null);

    const shortcuts = [
        {
            name: 'Add \nExpense',
            action: 'AddTransaction',
            props: { type: 'expense' },
            icon: 'minussquareo',
            key: '1',
        },
        {
            name: 'Add \nRevenue',
            action: 'AddTransaction',
            props: { type: 'revenue' },
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

    useEffect(() => {
        (async () => {
            fetchSummary();
            fetchLastTransactions();
        })()
    }, [])

    function handleNavigateTo(scrren: string, props?: object) {
        navigation.navigate(scrren, props);
    }

    function getGreeting() {
        return currentHour < 12 ? 'Good Morning' :
            (currentHour < 18 ? 'Good Afternoon' : 'Good Night')
    }

    async function fetchSummary() {
        try {
            const getSummary = await api.getSumaryStats();
            if (getSummary.error) throw getSummary.message;
            setSummaryValue({
                revenue: getSummary.revenue,
                expense: getSummary.expense,
                due: getSummary.due,
                overDue: getSummary.overDue
            })
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

    function mountCharts(data: Transactions[]) {
        const revenueData = data.filter((item) => item.transactionType == CategoryType.REVENUE).map((item) => Number(item.amount))
        const expenseData = data.filter((item) => item.transactionType == CategoryType.EXPENSE).map((item) => Number(item.amount))
        const dueData = data.filter((item) => item.transactionType == CategoryType.EXPENSE && item.paid == false).map((item) => Number(item.amount))
        const overDueData = data.filter((item) => item.transactionType == CategoryType.EXPENSE && item.paid == false && moment(item.dueDate).format() < moment().format()).map((item) => Number(item.amount))

        setChartsData({
            revenue: revenueData ? revenueData : [0, 0],
            expense: expenseData ? expenseData : [0, 0],
            due: dueData ? dueData : [0, 0],
            overDue: overDueData ? overDueData : [0, 0]
        })
    }

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
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <SummaryCard color={'#37b55a'} title={'Revenue'} chartsData={chartsData.revenue} value={summaryValue.revenue} />
                    <SummaryCard color={'#4643d3'} title={'Expense'} chartsData={chartsData.expense} value={summaryValue.expense} />
                    <SummaryCard color={'#f58218'} title={'Due'} chartsData={chartsData.due} value={summaryValue.due} />
                    <SummaryCard color={'#ff344c'} title={'Over Due'} chartsData={chartsData.overDue} value={summaryValue.overDue} />
                </ScrollView>
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
                                onPress={() => { handleNavigateTo(item.action, item.props); }}
                                style={styles.shortcutsCardContainer}
                            >
                                <View>
                                    <AntDesign name={item.icon} size={24} color='#4543d3' />
                                </View>

                                <Text style={styles.shortcutsCardTtile}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    }} />
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
                                    }} /></>) : (<>
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
