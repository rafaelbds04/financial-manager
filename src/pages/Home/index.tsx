import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AreaChart, LineChart, StackedAreaChart, Grid } from 'react-native-svg-charts'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';

import * as shape from 'd3-shape'

import SlidingUpPanel from 'rn-sliding-up-panel';

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

export default function Home() {

    const navigation = useNavigation();
    const currentHour = new Date().getHours();

    function handleNavigateTo(scrren: string) {
        navigation.navigate(scrren);
    }

    const { height, width } = Dimensions.get('window');

    const data = [50, 10, 40, 95, 10, 60, 85, 91, 35, 53, 40, 24]

    const summary = [
        {
            title: 'Revenues',
            value: 17200,
            porcentege: 50,
            key: '1',
            color: '#37b55a'
        },
        {
            title: 'Expenses',
            value: 100,
            porcentege: 50,
            key: '2',
            color: '#4643d3'
        },
        {
            title: 'To due',
            value: 100,
            porcentege: 50,
            key: '3',
            color: '#f58218'
        },
        {
            title: 'Overdue',
            value: 100,
            porcentege: 50,
            key: '4',
            color: 'red'
        }
    ]

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

    const transactions = [
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

    function getGreeting() {
        return currentHour < 12 ? 'Good Morning' :
            (currentHour < 6 ? 'Good Afternoon' : 'Good Night')
    }


    const [dragRange, setDragRange] = useState({
        top: height - 105,
        bottom: 300
    });

    const _draggedValue = new Animated.Value(180);
    const modalRef = useRef(null);


    return (
        <View style={styles.container}>
            <>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title} >{getGreeting()},</Text>
                        <Text style={styles.subtitle} >Rafael Bernardino!</Text>
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
                                <View style={{
                                    ...styles.summaryCard,
                                    backgroundColor: item.color
                                }}>
                                    <View>
                                        <Text style={styles.summaryCardSubtitle}>
                                            {item.title}</Text>
                                        <Text style={styles.summaryCardTitle}>
                                            R${item.value}</Text>
                                    </View>

                                    <LineChart
                                        style={{ height: 80 }}
                                        data={data}
                                        svg={{ stroke: 'rgb(255, 255, 255)', strokeWidth: 2 }}
                                        curve={shape.curveNatural}
                                        contentInset={{ top: 20, bottom: 2 }}
                                    >
                                    </LineChart>
                                </View>
                            )
                        }}

                    />
                </View>

                <LinearGradient
                    colors={['#fefefe', '#efefef', '#fcfcfc']}
                    style={{ paddingBottom: 30 }}
                >
                    <Text style={styles.shortcutsContainerTitle} >Shortcuts</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={shortcuts}
                        style={{ paddingHorizontal: 10 }}
                        renderItem={({ item }) => {
                            return (

                                <TouchableOpacity
                                    onPress={() => { handleNavigateTo(item.action) }}
                                    style={styles.shortcutsCardContainer}
                                >
                                    <View  >
                                        <AntDesign name={item.icon} size={24} color='#4543d3' />
                                    </View>

                                    <Text style={styles.shortcutsCardTtile} >{item.name}</Text>
                                </TouchableOpacity>



                            );
                        }}
                    />

                </LinearGradient>

            </>
            <View style={{ flex: 1 }}>

                <SlidingUpPanel
                    ref={modalRef}
                    draggableRange={dragRange}
                    animatedValue={_draggedValue}
                    backdropOpacity={0}
                    snappingPoints={[500]}
                    height={height + 20}
                    friction={0.9}
                >

                    <View style={styles.slidingPanel}>
                        <View style={styles.slidingPanelBottom} ></View>
                        <View style={styles.slidingPanelHeader}>
                            <Text style={styles.slidingPanelHeaderTitle}>Transactions</Text>
                            <Text style={styles.slidingPanelHeaderOptions}>All</Text>
                        </View>
                        <View style={styles.slidingPanelContent}>
                            <FlatList
                                data={transactions}
                                keyExtractor={(item) => item.key}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={styles.transactionItemCard}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={styles.transactionItemIcon}>
                                                    {item.credit ?
                                                        <AntDesign name="arrowup"
                                                            size={24} color="#43b864" />
                                                        :
                                                        <AntDesign name="arrowdown"
                                                            size={24} color="#e95e51" />
                                                    }

                                                </View>

                                                <View style={{ left: 30 }} >
                                                    <Text style={styles.transactionItemTitle}>
                                                        {item.title}</Text>
                                                    <Text style={styles.transactionItemSubtitle} >
                                                        5 Nov, 15:40</Text>
                                                </View>

                                            </View>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={{
                                                    ...styles.transactionItemValue,
                                                    color: `${item.credit ? '#43b864' : '#fff'}`
                                                }} >
                                                    {item.credit ? 'R$' : '- R$'} {item.amount}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }}

                            />

                        </View>

                    </View>

                </SlidingUpPanel>

            </View>

        </View>
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
    },
    transactionItemCard: {
        justifyContent: 'space-between',
        marginTop: 20,
        // backgroundColor: '#fff',
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
        fontSize: 18,
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