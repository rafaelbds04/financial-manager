import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'

const TransactionCardShimmer: React.FC<{ repetitions?: number }> = ({ repetitions = 1 }) => {
    var items = []

    for (let index = 0; index < repetitions; index++) {
        items.push(
            <View key = {index} style={styles.transactionItemCard}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.transactionItemIcon}>
                        <ShimmerPlaceholder
                            width={48} height={48} shimmerStyle={{ borderRadius: 40 }}>
                        </ShimmerPlaceholder>
                    </View>

                    <View style={{ left: 30 }} >
                        <ShimmerPlaceholder visible={false}
                            style={{ width: 210, borderRadius: 10 }}>
                        </ShimmerPlaceholder>

                        <ShimmerPlaceholder visible={false}
                            width={95} style={{ marginTop: 5, borderRadius: 10, }}
                        >
                        </ShimmerPlaceholder>

                    </View>

                </View>
                <View style={{ justifyContent: 'center', }}>
                    <ShimmerPlaceholder visible={false}
                        height={22} width={70} style={{ borderRadius: 10 }} >
                    </ShimmerPlaceholder>
                </View>
            </View>
        )
    }
    return (<>
        {items}
    </>
    );
}

export default TransactionCardShimmer;