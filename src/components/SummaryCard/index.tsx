import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { LineChart } from 'react-native-svg-charts'
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
    );
}

export default SummaryCard;