import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, ScrollView, FlatList, Modal } from 'react-native'
import PageHeader from '../../components/PageHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransactionDatePicker from '../../components/TransactionDatePicker';
import CategorySelector from '../../components/CategorySelector'
import { showMessage } from 'react-native-flash-message';
import api from '../../services/api';
import { CategorySelectorItem } from '../../components/CategorySelector/index';
import { ImageViewer } from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import DualButton from '../../components/DualButton';
import validators from '../../services/validators';
import { catchErrorMessage, unauthorized } from '../../services/utils';
import accounting from 'accounting';
import styles from './styles';
import CurrencyInput from '../../components/CurrencyInput';
import { FullTransaction } from '../TransactionDetail';

interface Params {
    transactionId: number
}

export interface Category {
    id: number
    name: string
    description: string
    error?: string
}

export enum CategoryType {
    EXPENSE = 'expense',
    REVENUE = 'revenue'
}

const EditTransaction = () => {

    const currentDate = new Date();
    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;

    const [attachmentsImages, setAttachmentsImages] = useState<IImageInfo[]>();
    const [attachmentsModal, setAttachmentsModal] =
        useState<{ visible: boolean, index?: number }>({ visible: false });


    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [paid, setPaid] = useState(true);
    const [type, setType] = useState(true);
    const [date, setDate] = useState(currentDate);
    const [dueDate, setDueDate] = useState(date);

    const [selectedCategory, setSelectedCategory] = useState<string | number>('0');
    const [categoriesItems, setCategoriesItems] = useState<CategorySelectorItem[]>([
        { label: 'Carregando', value: '0' }
    ]);

    const [blockActions, setBlockActions] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { statusCode, ...response } = await api.getTransaction(routeParams.transactionId)
                if (statusCode === 401) return unauthorized(navigation);
                if (response.error || statusCode !== 200) {
                    const errorMsg = response.message || response.error;
                    catchErrorMessage(errorMsg!);
                }
                await getCategoriesList(response.category.categoryType)
                autoFill(response);
            } catch (error) {
                catchErrorMessage(error?.message)
            }
        })()
    }, [])


    useEffect(() => {
        //Listen to switch category type
        (async () => {
            // await getCategoriesList(type)
        })();
    }, [type]);

    async function getCategoriesList(inputType: boolean | string) {
        try {
            const categoryType = (inputType || (inputType === 'expense')) ? CategoryType.EXPENSE : CategoryType.REVENUE
            const { response, statusCode } = await api.getCategoriesByType(categoryType);
            if (statusCode === 401) return unauthorized(navigation);
            if (!response.length) return
            const data = response.map((item: Category) => {
                const data = {
                    label: item.name,
                    value: item.id
                };
                return data;
            });
            if (!data.length) return
            setCategoriesItems(data);
            setSelectedCategory(data[0].value)
        } catch (error) {
            catchErrorMessage(error?.message)
        }
    }

    function handleBack() {
        if (blockActions) return
        navigation.goBack();
    }

    function handleChangeCategory(item: CategorySelectorItem) {
        setSelectedCategory(item.value);
    }

    function autoFill(data: FullTransaction) {
        const { name, amount, transactionDate, dueDate, attachments, category,
            paid, transactionType } = data;
        name && setName(name);
        amount && setAmount(accounting.formatMoney(Number(amount), {
            decimal: ',',
            thousand: '.',
            precision: 2,
            symbol: 'R$'
        }).toString());
        transactionType && setType((transactionType == CategoryType.EXPENSE))
        transactionDate && setDate(new Date(transactionDate));
        dueDate && setDueDate(new Date(date));
        attachments && setAttachmentsImages(attachments)
        paid && setPaid(paid);
        category && setSelectedCategory(category.id)
    }

    async function handleSaveTransaction() {
        if (blockActions) return
        setBlockActions(true)
        const transactionInfos = {
            name,
            transactionType: type ? 'expense' : 'revenue',
            amount: accounting.unformat(amount, ','),
            transactionDate: date,
            dueDate: !paid ? dueDate : undefined,
            paid,
            category: selectedCategory,
        }
        //If transaction is paid don't send due date
        paid && delete transactionInfos.dueDate

        const validate = await validators.validateTransactionCreate(transactionInfos);

        if (validate != true) {
            setBlockActions(false)
            showMessage({
                message: 'Error',
                description: validate.message.toString(),
                type: 'danger',
                duration: 5000
            })
            return
        }

        try {
            const response = await api.updateTransaction(JSON.stringify(transactionInfos), routeParams.transactionId);
            if (response.statusCode === 401) return unauthorized(navigation);
            if (response.statusCode != 200) {
                setBlockActions(false)
                throw response
            }
            showMessage({
                message: 'Transação salva com sucesso!',
                type: 'success'
            })
            navigation.reset({
                routes: [{ name: 'Home' }]
            })
            setBlockActions(false)
        } catch (error) {
            setBlockActions(false)
            catchErrorMessage(error?.message);
        }

    }

    return (
        <View style={styles.container}>

            < PageHeader title={'Editar transação'} />

            <View style={styles.content} >
                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}  >
                    <View style={styles.inputContainer} >
                        <Text style={styles.inputTitle} >Nome</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>

                    <DualButton sectionName={'Tipo'} btn1Name={'Despesa'}
                        btn2Name={'Receita'} value={type} onChange={setType} />

                    <DualButton sectionName={'Pagamento'} btn1Name={'Pago'}
                        btn2Name={'Não pago'} value={paid} onChange={setPaid} />

                    <TransactionDatePicker paid={paid} date={date} onChange={setDate}
                        dueDate={dueDate} onChangeDue={setDueDate} />

                    <CategorySelector
                        sectionName={'Categoria'}
                        items={categoriesItems}
                        defaultValue={selectedCategory}
                        onChangeItem={handleChangeCategory}
                    />

                    <CurrencyInput onChangeAmount={setAmount} value={amount} />

                    {attachmentsImages && (
                        <>
                            <Text style={styles.inputTitle} >Anexos</Text>
                            <View style={styles.attachmentImageContainer}>
                                <FlatList
                                    data={attachmentsImages}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={item => item.url}
                                    renderItem={(data) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => setAttachmentsModal({
                                                    visible: true,
                                                    index: data.index
                                                })}>
                                                <Image style={styles.attachmentImage}
                                                    source={{ uri: data.item.url }} />
                                            </TouchableOpacity>
                                        )
                                    }}
                                />

                                <Modal visible={attachmentsModal?.visible} transparent={true}
                                    onRequestClose={() => setAttachmentsModal({ visible: false })}>
                                    <ImageViewer imageUrls={attachmentsImages} index={attachmentsModal.index}
                                        enableSwipeDown={true} onCancel={() => setAttachmentsModal({ visible: false })} />
                                </Modal>
                            </View>
                        </>
                    )}
                </ScrollView>


                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={() => { handleBack() }} >
                        <Text style={[styles.buttonText, { color: '#a8a4d3' }]} >Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button,
                    { backgroundColor: '#4643d3' }]} onPress={() => { handleSaveTransaction() }} >
                        <Text style={styles.buttonText} >Salvar</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}
export default EditTransaction;

