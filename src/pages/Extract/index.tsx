import React, { useEffect, useState } from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Transactions } from '../Home';
import api, { TransactionsParamsOptions } from '../../services/api';
import { catchErrorMessage, unauthorized } from '../../services/utils';
import moment from 'moment';
import TransactionCardShimmer from '../../components/TransactionCardShimmer';
import SelectionHorizontalList from '../../components/SelectionHorizontalList';
import TransactionCard from '../../components/TransactionCard';
import DualDatePicker from '../../components/DualDatePicker';
import CategorySelector, { CategorySelectorItem } from '../../components/CategorySelector';
import { Category } from '../EditTransaction';

type TypeValues = 'all' | 'revenue' | 'expense' | 'overdue' | 'due' | 'custom'
type TransactionTypes = 'any' | 'revenue' | 'expense'

interface Params {
    type?: TypeValues
}

interface TransactionsExtract {
    data?: Transactions[]
    totalCount?: number | string | null
}

interface CustomSerchOptions {
    transactionName?: string;
    fromDate: Date; toDate: Date
    transactionType?: TransactionTypes;
    transactionCategory?: string;
    transactionPossiblesCategories?: CategorySelectorItem[]
}

export default function Extract() {

    const [modalVisible, setModalVisible] = useState(false);
    const [seletedType, setSeletedType] = useState('');
    const [fetchOptions, setFetchOptions] = useState<TransactionsParamsOptions>({});
    const [customSerchOptions, setCustomSerchOptions] = useState<CustomSerchOptions>(
        {
            transactionCategory: 'any', transactionPossiblesCategories: [{ label: '-', value: 'any' }],
            transactionType: 'any',
            fromDate: moment().clone().startOf('month').startOf('day').toDate(),
            toDate: moment().clone().endOf('month').endOf('day').toDate()
        })

    const [transactions, setTransactions] = useState<TransactionsExtract>();
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false);

    const selectLisTypeData = [
        { name: 'Todos', value: 'all' },
        { name: 'Despesas', value: 'expense' },
        { name: 'Receitas', value: 'revenue' },
        { name: 'Vencido', value: 'overdue' },
        { name: 'À vencer', value: 'due' },
        { name: 'Customizado', value: 'custom' }
    ]

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;

    useEffect(() => {
        (async () => {
            try {
                routeParams?.type ? await handleChangeSeletedTransactionType(routeParams?.type)
                    : await handleChangeSeletedTransactionType('all')
            } catch (error) {
                catchErrorMessage(error?.message)
            }
        })()
    }, [])

    async function fetchTransactions(fetchOptions?: TransactionsParamsOptions) {
        try {
            setLoadingTransactions(true)
            const response = await api.getTransactions(fetchOptions);
            if (response.statusCode === 401) return unauthorized(navigation);
            if (response.error) throw response
            setTransactions({ data: response.data, totalCount: response.totalCount });
            setFetchOptions({ skip: '0' });
            setLoadingTransactions(false)
        } catch (error) {
            setLoadingTransactions(false)
            catchErrorMessage(error?.message);
        }
    }

    function handleNavigateToTransactionDetail(transactionId: number) {
        navigation.navigate('TransactionDetail', { transactionId: transactionId })
    }

    function handleBack() {
        navigation.goBack();
    }

    async function handleChangeSeletedTransactionType(item: TypeValues) {
        if (item === 'custom') { setSeletedType(item); return handleOpenCustomSearchModal(); }
        if (seletedType !== item) {
            setSeletedType(item);
            try {
                const params = { ...getParamsOptionsFromSelectedSerchOption(item), skip: '0' }
                await fetchTransactions(params);
                setFetchOptions(params);
            } catch (error) {
                catchErrorMessage(error?.message)
            }
        }
    }

    async function loadMoreTransactions() {
        const totalCount = (Number(transactions?.totalCount));
        if (totalCount > (Number(fetchOptions?.skip) + (totalCount % 20))) {
            try {
                setLoadingMoreTransactions(true);
                const nextSkip = (Number(fetchOptions?.skip)) + 20
                const newOptions = { ...fetchOptions, skip: nextSkip.toString() }
                setFetchOptions(newOptions);
                const response = await api.getTransactions(newOptions);
                if (response.statusCode === 401) return unauthorized(navigation);

                setTransactions({
                    data: [...transactions?.data!, ...response.data],
                    totalCount: response.totalCount
                })
                setLoadingMoreTransactions(false);

            } catch (error) {
                setLoadingMoreTransactions(false);
                catchErrorMessage(error?.message)
            }

        }
    }

    function getParamsOptionsFromSelectedSerchOption(type?: TypeValues): TransactionsParamsOptions {
        switch (type) {
            case 'all':
                return {}
                break;
            case 'revenue':
                return { transactionType: 'revenue', take: '20' }
                break;
            case 'expense':
                return { transactionType: 'expense', take: '20' }
                break;
            case 'overdue':
                return {
                    paid: false,
                    dueStartDate: moment().subtract(180, 'days').toISOString(),
                    dueEndDate: moment().toISOString()
                }
                break;
            case 'due':
                return {
                    paid: false,
                    dueStartDate: moment().toISOString(),
                    dueEndDate: moment().add(180, 'days').toISOString()
                }
                break;
            default:
                return {}
        }
    }

    async function handleOpenCustomSearchModal() {
        setModalVisible(true);
        try {
            const categories = await getCategoriesList();
            setCustomSerchOptions({
                ...customSerchOptions, transactionPossiblesCategories: categories
            })
        } catch (error) {

        }
    }

    async function handleFetchCustomSerchOptions() {
        const { fromDate, toDate, transactionName, transactionType, transactionCategory } = customSerchOptions;
        const params = { from: moment(fromDate).toISOString(), to: moment(toDate).toISOString(), name: transactionName, transactionType, category: transactionCategory }
        transactionCategory === 'any' && delete params.category
        transactionType === 'any' && delete params.transactionType
        transactionName === undefined && delete params.name
        try {
            setModalVisible(false);
            await fetchTransactions({ ...params, skip: '0' });
            setFetchOptions({ ...params, skip: '0' })
        } catch (error) {
            catchErrorMessage(error?.message)
        }
    }

    async function getCategoriesList(): Promise<CategorySelectorItem[] | undefined> {
        try {
            //TODO: IMPROVE BEST PRATICES
            const { response, statusCode } = await api.getAllCategories();
            if (statusCode === 401) throw unauthorized(navigation);
            if (!response.length) return
            const data: CategorySelectorItem[] = [{ label: '-', value: 'any' }]
            data.push(...response.map((item: Category) => ({
                label: item.name,
                value: item.id
            })))
            if (!data.length) return
            return data
        } catch (error) {
            catchErrorMessage(error?.message)
        }
    }

    const modalBody = (
        <View style={styles.modal}>
            <View style={styles.content}>
                <View style={styles.inputContainer} >
                    <Text style={styles.inputTitle} >Nome</Text>
                    <TextInput style={styles.input} value={customSerchOptions.transactionName}
                        onChangeText={(text) => setCustomSerchOptions({ ...customSerchOptions, transactionName: text })}
                    />
                </View>
                <View style={[styles.inputContainer]}>
                    <DualDatePicker
                        fromDate={customSerchOptions.fromDate}
                        toDate={customSerchOptions.toDate}
                        onChangeFromDate={(value: Date) => setCustomSerchOptions({ ...customSerchOptions, fromDate: value })}
                        onChangeToDate={(value: Date) => setCustomSerchOptions({ ...customSerchOptions, toDate: value })} />
                </View>
                <View style={styles.inputContainer} >
                    <CategorySelector
                        sectionName={'Tipo de lançamento'}
                        items={[{ label: '-', value: 'any' }, { label: 'Receita', value: 'revenue' }, { label: 'Despesa', value: 'expense' }]}
                        defaultValue={customSerchOptions?.transactionType}
                        onChangeItem={(value: any) => setCustomSerchOptions({ ...customSerchOptions, transactionType: value.value })}
                    />
                </View>
                <View style={styles.inputContainer} >
                    <CategorySelector
                        sectionName={'Categoria'}
                        items={customSerchOptions?.transactionPossiblesCategories}
                        defaultValue={customSerchOptions.transactionCategory}
                        onChangeItem={(value: any) => setCustomSerchOptions({ ...customSerchOptions, transactionCategory: value.value })}
                    />
                </View>


            </View>
            <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.button} onPress={() => handleFetchCustomSerchOptions()} >
                    <Text style={styles.buttonText} >Buscar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => handleBack()}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} >Extrato</Text>
                <TouchableOpacity onPress={() => handleChangeSeletedTransactionType('custom')}>
                    <Feather name="search" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.selectionList}>
                <SelectionHorizontalList data={selectLisTypeData} seleted={seletedType}
                    onChangeSeleted={(item: TypeValues) => handleChangeSeletedTransactionType(item)} />
            </View>

            <View style={styles.content}>
                {
                    !loadingTransactions ? (<FlatList
                        data={transactions?.data}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={async () => await loadMoreTransactions()}
                        onEndReachedThreshold={0.05}
                        ListFooterComponent={loadingMoreTransactions ? (<TransactionCardShimmer repetitions={6} />) : null}
                        renderItem={({ item }) => {
                            return (
                                <TransactionCard data={item}
                                    onPress={() => handleNavigateToTransactionDetail(item.id)} />
                            );
                        }} />) : (<><TransactionCardShimmer repetitions={8} /></>)
                }
            </View>

            <Modal visible={modalVisible} style={{ backgroundColor: '#6664d4' }} transparent={true}
                onRequestClose={() => { setModalVisible(false) }}>
                {modalBody}
            </Modal>
        </View>
    )

}