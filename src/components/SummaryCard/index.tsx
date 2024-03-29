import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { LineChart } from 'react-native-svg-charts'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import * as shape from 'd3-shape'
import { useNavigation } from '@react-navigation/native';

interface SummaryCardProps {
    color: string,
    title: string,
    type: string,
    value?: number
    chartsData: Number[]
}

const SummaryCard: React.FC<SummaryCardProps> = (item) => {

    const navigation = useNavigation();

    function handleNavigateToExtract(type: string) {
        navigation.navigate('Extract', { type: item.type })
    }

    return (
        <TouchableOpacity style={[styles.summaryCard,
        { backgroundColor: item.color }]} activeOpacity={1}
            onPress={() => item.value && handleNavigateToExtract(item.type)} >
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

        </TouchableOpacity>
    );
}

export default SummaryCard;