import React, { useEffect, useState } from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Transactions } from '../Home';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import api, { TransactionsParamsOptions } from '../../services/api';
import { catchErrorMessage, unauthorized } from '../../services/utils';
import { formatMoney } from 'accounting';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import DatePicker from '../../components/DatePicker/index';
import TransactionCardShimmer from '../../components/TransactionCardShimmer';
import PageHeader from '../../components/PageHeader/index';
import SelectionHorizontalList from '../../components/SelectionHorizontalList';
import TransactionCard from '../../components/TransactionCard';

interface Params {
    transactionId: number
}

export default function Extract() {

    const [modalVisible, setModalVisible] = useState(false);
    const [shimmerVisible, setShimmerVisible] = useState(false);
    const [seletedType, setSeletedType] = useState('all');
    const [fetchOptions, setFetchOptions] = useState<TransactionsParamsOptions>();

    const [transactions, setTransactions] = useState<Transactions[] | undefined>();

    const selectLisTypeData = [
        { name: 'Todas', value: 'all' },
        { name: 'Despesas', value: 'expense' },
        { name: 'Receitas', value: 'revenue' },
        { name: 'Vencido', value: 'overdue' },
        { name: 'À vencer', value: 'todue' }
    ]

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;

    useEffect(() => {
        (async () => {
            try {
                await fetchTransactions();
            } catch (error) {
                catchErrorMessage(error?.message)
            }
        })()
    }, [])

    async function fetchTransactions(fetchOptions?: TransactionsParamsOptions) {
        try {
            const response = await api.getTransactions(fetchOptions);
            if (response.statusCode === 401) return unauthorized(navigation);
            if (response.error) throw response
            setTransactions(response.data);
        } catch (error) {
            catchErrorMessage(error?.message);
        }
    }

    function handleNavigateToTransactionDetail(transactionId: number) {
        navigation.navigate('TransactionDetail', { transactionId: transactionId })
    }

    function handleBack() {
        navigation.goBack();
    }

    async function handleChangeSeletedTransactionType(item: string) {
        console.log(item)
        if (seletedType !== item) {
            setSeletedType(item);
            try {
                await fetchTransactions(getParamsOptionsFromTypeName(item));
            } catch (error) {
                catchErrorMessage(error?.message)
            }
        }
    }

    function getParamsOptionsFromTypeName(type: string): TransactionsParamsOptions {
        switch (type) {
            case 'all':
                return {}
                break;
            case 'revenue':
                return { transactionType: 'revenue' }
                break;
            case 'expense':
                return { transactionType: 'expense' }
                break;
            case 'overdue':
                return { paid: false }
                break;
            case 'todue':
                return {
                    paid: false, from: moment().toISOString(),
                    to: moment().add(60).toISOString()
                }
                break;
            default:
                return {}
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => handleBack()}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} >Extrato</Text>
                <TouchableOpacity>
                    <AntDesign name="bars" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.selectionList}>
                <SelectionHorizontalList data={selectLisTypeData} seleted={seletedType}
                    onChangeSeleted={(item: string) => handleChangeSeletedTransactionType(item)} />
            </View>

            <View style={styles.content}>
                {transactions ? (<>
                    <FlatList
                        data={transactions}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            return (
                                <TransactionCard data={item}
                                    onPress={() => handleNavigateToTransactionDetail(item.id)} />
                            );
                        }} /></>) : (<>
                            <TransactionCardShimmer repetitions={8} />
                        </>)}
            </View>

            <Modal visible={modalVisible} style={{ backgroundColor: '#6664d4' }} transparent={true}
                onRequestClose={() => { }}>
            </Modal>
        </View>
    )

}