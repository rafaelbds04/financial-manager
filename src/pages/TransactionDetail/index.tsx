import React, { useEffect, useState } from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Transactions } from '../Home';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import api from '../../services/api';
import { catchErrorMessage, unauthorized } from '../../services/utils';
import { formatMoney } from 'accounting';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import DatePicker from '../../components/DatePicker/index';
import { Asset } from 'expo-asset';

interface Params {
    transactionId: number
}

export interface FullTransaction extends Transactions {
    attachments?:
    {
        id: number,
        url: string,
        key: string,
        defaultUrl?: string
    }[]
    author?: {
        name: string,
        email: string,
    },
}

export default function TransactionDetail() {

    const [modalVisible, setModalVisible] = useState(false);
    const [shimmerVisible, setShimmerVisible] = useState(false);
    const [transaction, setTransaction] = useState<FullTransaction>()

    const [toConfirmPaymentDate, setToConfirmPaymentDate] = useState<Date>(new Date());
    const [confirmPaymentModal, setConfirmPaymentModal] = useState<boolean>(false);

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;
    useEffect(() => {
        (async () => {
            try {
                const { statusCode, ...response } = await api.getTransaction(routeParams.transactionId)
                if (statusCode === 401) return unauthorized(navigation);
                if (response.error || statusCode !== 200) {
                    const errorMsg = response.message || response.error;
                    catchErrorMessage(errorMsg!);
                }
                setTransaction(serializeTransaction(response));
                setShimmerVisible(true);
            } catch (error) {
                catchErrorMessage(error?.message)
            }
        })()
    }, [])

    function serializeTransaction(transaction: FullTransaction): FullTransaction {
        const serializedAttachments = transaction.attachments?.map(value => {
            const attachmentsFileExtension = value.url.split('.').pop()
            if (attachmentsFileExtension === 'pdf') {
                return {
                    ...value,
                    url: Asset.fromModule(require('../../assets/PDF_icon.png')).uri,
                    defaultUrl: value.url
                }
            }
            return { ...value }
        })
        return { ...transaction, attachments: serializedAttachments }
    }

    async function handleRemoveTransaction() {
        if (transaction?.id) {
            try {
                const { statusCode } = await api.deleteTransaction(transaction?.id)
                if (statusCode === 401) return unauthorized(navigation);
                if (statusCode === 200) {
                    showMessage({
                        message: 'Transação deletada com sucesso!',
                        description: `${transaction?.id} - deletada`,
                        type: 'success'
                    })
                    navigation.reset({
                        routes: [{ name: 'Home' }]
                    })
                    return
                }
                catchErrorMessage('Ocorreu um erro ao deletar transação.')
            } catch (error) {
                catchErrorMessage(error?.message)
            }
        }
    }

    function handleConfirmDelete() {
        Alert.alert('Confirmar remoção',
            'Você tem certeza que deseja apagar essa transação?', [
            { text: 'Apagar transação', onPress: () => { handleRemoveTransaction() } },
            { text: 'Voltar' }
        ])
    }

    async function confirmPayment() {
        try {
            const data = JSON.stringify({
                paid: true,
                paidDate: toConfirmPaymentDate
            })
            const { statusCode, ...response } = await api.updateTransaction(data, routeParams.transactionId)
            showMessage({
                message: 'Confirmando pagamento',
                type: 'info'
            })
            setConfirmPaymentModal(false);
            if (statusCode === 401) return unauthorized(navigation);
            if (statusCode === 200) {
                showMessage({
                    message: 'Pagamento confirmado com sucesso!',
                    type: 'success'
                })
                navigation.reset({
                    routes: [{ name: 'Home' }]
                })
                return
            }
            throw response
        } catch (error) {
            catchErrorMessage(error?.message)
        }
    }

    function handleEdit() {
        navigation.navigate('EditTransaction', { transactionId: routeParams.transactionId })
    }

    function handleBack() {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => handleBack()}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <ScrollView>
                    <ShimmerPlaceholder shimmerStyle={{ borderRadius: 10, marginTop: 50, }} height={40} visible={shimmerVisible}>
                        <Text style={styles.title} >{transaction?.name}</Text>
                        <Text style={styles.name}>{transaction?.category.name}</Text>
                    </ShimmerPlaceholder>
                    <View style={styles.horizontalRule}></View>
                    <ShimmerPlaceholder shimmerStyle={[styles.description, { borderRadius: 10 }]} height={18} visible={shimmerVisible}>
                        <View style={styles.description}>
                            <Text style={styles.name}>Data</Text>
                            <Text style={styles.value}>{moment(transaction?.transactionDate).format('DD/MM/YYYY, HH:mm')}</Text>
                        </View>
                    </ShimmerPlaceholder>
                    <ShimmerPlaceholder shimmerStyle={[styles.description, { borderRadius: 10 }]} height={17} visible={shimmerVisible}>
                        {transaction?.dueDate && (
                            <View style={styles.description}>
                                <Text style={styles.name}>Vencimento</Text>
                                <Text style={styles.value}>{moment(transaction.dueDate).format('DD/MM/YYYY')}</Text>
                            </View>
                        )}
                    </ShimmerPlaceholder>
                    <ShimmerPlaceholder shimmerStyle={[styles.description, { borderRadius: 10 }]} height={18} visible={shimmerVisible}>
                        <View style={styles.description}>
                            <Text style={styles.name}>Status</Text>
                            <Text style={styles.value}>{transaction?.paid == true ? 'Pago' : 'Não pago'}</Text>
                        </View>
                    </ShimmerPlaceholder>
                    <ShimmerPlaceholder shimmerStyle={[styles.description, { borderRadius: 10 }]} height={18} visible={shimmerVisible}>
                        <View style={styles.description}>
                            <Text style={styles.name}>Autor</Text>
                            <Text style={styles.value}>{transaction?.author?.name}</Text>
                        </View>
                    </ShimmerPlaceholder>
                    <View style={styles.horizontalRule}></View>
                    <ShimmerPlaceholder shimmerStyle={[styles.description, { borderRadius: 10 }]} height={40} visible={shimmerVisible}>
                        <View style={styles.description}>
                            <Text style={styles.name}>Valor</Text>
                            <Text style={styles.amount}>
                                {transaction?.transactionType == 'expense' && '-'}
                                {formatMoney(Number(transaction?.amount), {
                                    decimal: ',',
                                    thousand: '.',
                                    precision: 2,
                                    symbol: 'R$'
                                }).toString()}</Text>
                        </View>
                    </ShimmerPlaceholder>

                    <View style={styles.actionsContent}>
                        <ShimmerPlaceholder shimmerStyle={{ borderRadius: 10, marginTop: 15 }} height={35} width={250} visible={shimmerVisible}>
                            {(!transaction?.paid) && (
                                <TouchableOpacity style={[styles.attachmentsButton,
                                { backgroundColor: '#37b55a' }]} onPress={() => { setConfirmPaymentModal(true) }} >
                                    <Text style={styles.attachmentsText} >ADICIONAR PAGAMENTO</Text>
                                    <AntDesign name="arrowright" size={24} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </ShimmerPlaceholder>

                        <ShimmerPlaceholder shimmerStyle={{ borderRadius: 10, marginTop: 15 }} height={35} width={250} visible={shimmerVisible}>
                            {(transaction?.attachments?.length! > 0) && (<>
                                <TouchableOpacity style={styles.attachmentsButton}
                                    onPress={() => { setModalVisible(true) }} >
                                    <Text style={styles.attachmentsText} >VER ANEXOS</Text>
                                    <AntDesign name="arrowright" size={24} color="#fff" />
                                </TouchableOpacity></>)}
                        </ShimmerPlaceholder>
                    </View>

                    <Modal visible={modalVisible} transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <ImageViewer
                            imageUrls={transaction?.attachments}
                            enableSwipeDown={true}
                            onClick={(func, index) => {
                                if (transaction?.attachments?.[index!].defaultUrl) {
                                    Linking.openURL(transaction?.attachments?.[index!].defaultUrl!)
                                }
                            }}
                            onCancel={() => setModalVisible(false)} />
                    </Modal>

                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.button,
                    { backgroundColor: '#6664d4' }]} onPress={() => { handleEdit() }} >
                        <Text style={styles.buttonText} >Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { handleConfirmDelete() }} >
                        <Text style={[styles.buttonText, { color: '#fff' }]} >Apagar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={confirmPaymentModal} style={{ backgroundColor: '#6664d4' }} transparent={true}
                onRequestClose={() => { setConfirmPaymentModal(false) }}>
                <View style={styles.confirmModal} >
                    <DatePicker date={toConfirmPaymentDate} onChange={setToConfirmPaymentDate} />

                    <View style={styles.confirmModalFooter}>
                        <TouchableOpacity style={styles.button} onPress={() => { setConfirmPaymentModal(false) }} >
                            <Text style={[styles.buttonText]} >Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button,
                        { backgroundColor: '#37b55a' }]} onPress={() => { confirmPayment() }} >
                            <Text style={styles.buttonText} >Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )

}