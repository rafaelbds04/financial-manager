import React from 'react';
import { View, Text } from 'react-native';
import { CategoryType } from '../../pages/AddTransaction';
import styles from './styles';
import { AntDesign } from '@expo/vector-icons';
import { Transactions } from '../../pages/Home';
import moment from 'moment';

interface TransactionCardProps {
    data: Transactions
}

const TransactionCard: React.FC<TransactionCardProps> = ({ data }) => {
    return (
        <View style={styles.transactionItemCard}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.transactionItemIcon}>
                    {data.transactionType == CategoryType.REVENUE ?
                        <AntDesign name="arrowup"
                            size={24} color="#43b864" />
                        :
                        <AntDesign name="arrowdown"
                            size={24} color="#e95e51" />
                    }
                </View>
                <View style={{ left: 30 }} >
                    <Text style={styles.transactionItemTitle}>
                        {data.name.length < 15 ? data.name : `${data.name.substring(0, 15)}...`}</Text>
                    <Text style={styles.transactionItemSubtitle} >
                        {moment(data.transactionDate).format('DD MMM, HH:mm')}</Text>
                </View>
            </View>
            <View style={{ justifyContent: 'center' }}>
                <Text style={{
                    ...styles.transactionItemValue,
                    color: `${data.transactionType == CategoryType.REVENUE ? '#43b864' : '#fff'}`
                }} >
                    {data.transactionType == CategoryType.REVENUE ? 'R$' : '- R$'} {data.amount}
                </Text>
            </View>
        </View>
    );
}

export default TransactionCard;