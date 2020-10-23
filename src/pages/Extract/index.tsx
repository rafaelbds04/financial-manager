import React, { useEffect, useState } from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Transactions } from '../Home';
import api, { TransactionsParamsOptions } from '../../services/api';
import { catchErrorMessage, unauthorized } from '../../services/utils';
import moment from 'moment';
import TransactionCardShimmer from '../../components/TransactionCardShimmer';
import SelectionHorizontalList from '../../components/SelectionHorizontalList';
import TransactionCard from '../../components/TransactionCard';

interface Params {
    type?: string
}

export default function Extract() {

    const [modalVisible, setModalVisible] = useState(false);
    const [seletedType, setSeletedType] = useState('all');
    const [fetchOptions, setFetchOptions] = useState<TransactionsParamsOptions>();

    const [transactions, setTransactions] = useState<Transactions[] | undefined>();

    const selectLisTypeData = [
        { name: 'Todas', value: 'all' },
        { name: 'Despesas', value: 'expense' },
        { name: 'Receitas', value: 'revenue' },
        { name: 'Vencido', value: 'overdue' },
        { name: 'À vencer', value: 'due' }
    ]

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;

    useEffect(() => {
        (async () => {
            try {
                routeParams?.type ? handleChangeSeletedTransactionType(routeParams?.type)
                    : await fetchTransactions()
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
        if (seletedType !== item) {
            setSeletedType(item);
            try {
                const params = { ...getParamsOptionsFromTypeName(item), skip: '0' }
                await fetchTransactions(params);
                setFetchOptions(params);
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
            case 'due':
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