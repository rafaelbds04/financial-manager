import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
<<<<<<< HEAD
import { LineChart } from 'react-native-svg-charts'
=======
import { AreaChart, LineChart, StackedAreaChart, Grid } from 'react-native-svg-charts'
>>>>>>> 07b5900b2c03d80f639a0ee91e843ef3a82852e4
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import * as shape from 'd3-shape'

interface SummaryCardProps {
    color: string,
    title: string,
    value?: number
    chartsData: Number[]
}

const SummaryCard: React.FC<SummaryCardProps> = (item) => {
    return (
        <View style={[styles.summaryCard,
<<<<<<< HEAD
        { backgroundColor: item.color }]}>
            <View>
                <Text style={styles.summaryCardSubtitle}>
                    {item.title}</Text>
                <ShimmerPlaceholder
                    height={20}
                    width={60}
                    shimmerStyle={{ borderRadius: 10, marginTop: 5 }}
                    visible={(item.value ? true : false)}
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
                    data={item.chartsData}
                    svg={{ stroke: 'rgb(255, 255, 255)', strokeWidth: 2 }}
                    curve={shape.curveNatural}
                    contentInset={{ top: 20, bottom: 10 }}
                >
                </LineChart>
            </ShimmerPlaceholder>
        </View>
=======
            { backgroundColor: item.color }]}>

                <View>

                    <Text style={styles.summaryCardSubtitle}>
                        {item.title}</Text>

                    <ShimmerPlaceholder
                        height={20}
                        width={60}
                        shimmerStyle={{ borderRadius: 10, marginTop: 5 }}
                        visible={(item.value ? true : false)}
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
                        data={item.chartsData}
                        svg={{ stroke: 'rgb(255, 255, 255)', strokeWidth: 2 }}
                        curve={shape.curveNatural}
                        contentInset={{ top: 20, bottom: 10 }}
                    >
                    </LineChart>
                </ShimmerPlaceholder>
            </View>
>>>>>>> 07b5900b2c03d80f639a0ee91e843ef3a82852e4
    );
}

export default SummaryCard;