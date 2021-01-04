import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, ScrollView, FlatList, Modal } from 'react-native'
import PageHeader from '../../components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TransactionDatePicker from '../../components/TransactionDatePicker';
import CategorySelector from '../../components/CategorySelector'
import { showMessage } from 'react-native-flash-message';
import api from '../../services/api';
import { CategorySelectorItem } from '../../components/CategorySelector/index';
import { Receipt, Attacment } from './CodeScanner/index';
import { ImageViewer } from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import DualButton from '../../components/DualButton';
import { serialize } from 'object-to-formdata';
import validators from '../../services/validators';
import { catchErrorMessage, unauthorized } from '../../services/utils';
import accounting from 'accounting';
import styles from './styles';
import CurrencyInput from '../../components/CurrencyInput';
import SingInInput from '../../components/SingInInput';

interface Params {
    attachmentImage?: string;
    receiptScan?: { scannedAt?: string, code?: string }
    type?: string;
}

export interface Category {
    id: number
    name: string
    description: string
    categoryType: string
    error?: string
}

export enum CategoryType {
    EXPENSE = 'expense',
    REVENUE = 'revenue'
}

const AddTransaction = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;

    const [capturedAttachment, setCapturedAttachment] = useState<string | null>(null);
    const [receiptAttachment, setReceiptAttachment] = useState<Attacment>();
    const [attachmentsImages, setAttachmentsImages] = useState<IImageInfo[]>();
    const [attachmentsModal, setAttachmentsModal] =
        useState<{ visible: boolean, index?: number }>({ visible: false });

    const currentDate = new Date();

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [paid, setPaid] = useState(true);
    const [type, setType] = useState<boolean>();
    const [date, setDate] = useState(currentDate);
    const [dueDate, setDueDate] = useState(currentDate);
    const [blockActions, setBlockActions] = useState(false);
    const [receiptKey, setReceiptKey] = useState<string | undefined>();
    const [selectedCategory, setSelectedCategory] = useState<string | number>('0');
    const [categoriesItems, setCategoriesItems] = useState<CategorySelectorItem[]>([
        { label: 'Carregando', value: '0' }
    ]);

    //On mount, component get params and set transaction type
    useEffect(() => {
        if (type === undefined) {
            if (routeParams?.type == 'expense') {
                setType(true)
                setCategoryList(true);
            } else {
                setType(false)
                setCategoryList(false);
            }
        }
    }, [])

    //Every time when scans and go back to the screen called the function to fetch a receipt.
    useEffect(() => {
        (async () => {
            routeParams?.receiptScan?.code && await catchReceipt(routeParams?.receiptScan.code);
        })()
    }, [routeParams?.receiptScan])

    //Checking images changes
    useEffect(() => {
        const images: IImageInfo[] = []
        if (routeParams?.attachmentImage) {
            setCapturedAttachment(routeParams?.attachmentImage);
            images.push({
                url: routeParams?.attachmentImage
            })
        }

        if (receiptAttachment?.key) {
            const imageUri = receiptAttachment?.url;
            imageUri && images.push({ url: imageUri });
        }

        setAttachmentsImages(images);
    }, [routeParams?.attachmentImage, receiptAttachment?.key]);


    function handleBack() {
        if (blockActions) return
        navigation.goBack();
    }

    function handleAddAttachmentFromCamera() {
        if (blockActions) return
        navigation.navigate('AttacmentCamera');
    }

    function handleReadCodeFromReceipt() {
        if (blockActions) return
        navigation.navigate('CodeScanner');
    }

    function handleChangeCategory(item: CategorySelectorItem) {
        setSelectedCategory(item.value);
    }

    async function setCategoryList(type: boolean) {
        try {
            const categoryType = type ? CategoryType.EXPENSE : CategoryType.REVENUE
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
    };

    async function catchReceipt(data: string) {
        try {
            showMessage({
                message: 'Pegando NF',
                description: 'Por favor aguarde',
                type: "info",
                hideOnPress: false,
                autoHide: false
            })
            setBlockActions(true);
            const { response, statusCode } = await api.getReceipt(data);
            if (statusCode === 401) return unauthorized(navigation);

            setBlockActions(false);
            if (response.error || statusCode !== 200) {
                const errorMsg = response.error || response.message;
                catchErrorMessage(errorMsg!);

                response.totalAmount && autoFillFromReceipt(
                    { totalAmount: response.totalAmount })
                return
            }

            showMessage({
                message: 'NF obtida com sucesso!',
                type: 'success'
            })
            autoFillFromReceipt(response);

        } catch (error) {
            setBlockActions(false);
            catchErrorMessage(error);
            return
        }
    }

    function autoFillFromReceipt(data: Receipt) {
        const { emitter, emittedDate, totalAmount, attachment, receiptKey } = data;
        emitter && setName(emitter);
        totalAmount && setAmount(accounting.formatMoney(Number(data.totalAmount), {
            decimal: ',',
            thousand: '.',
            precision: 2,
            symbol: 'R$'
        }).toString());
        emittedDate && setDate(new Date(emittedDate));
        attachment && setReceiptAttachment(attachment);
        receiptKey && setReceiptKey(receiptKey);
    }

    async function handleAddTransaction() {
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
                description: validate.message,
                type: 'danger',
                duration: 5000
            })
            return
        }

        //Serialize obj to formdata
        const formData: FormData = serialize(transactionInfos)

        //Check exist receipt attachment and receiptKey to add form data.
        receiptAttachment?.id && formData
            .append('receiptAttachment', receiptAttachment?.id.toString())
        receiptKey && formData.append('receiptKey', receiptKey)

        //if exist attachment send with form
        capturedAttachment && formData.append('files', JSON.parse(JSON.stringify({
            type: 'image/jpeg',
            uri: capturedAttachment,
            name: capturedAttachment.split('/').pop()
        })))

        showMessage({
            message: 'Enviando transação',
            type: "info",
            autoHide: false
        })

        try {
            const response = await api.addTransaction(formData);
            if (response.statusCode === 401) return unauthorized(navigation);
            if (response.statusCode != 201) {
                setBlockActions(false)
                throw response
            }
            showMessage({
                message: 'Transação criada com sucesso!',
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

            < PageHeader title={'Adicionar transação'} />

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
                        btn2Name={'Receita'} value={type} onChange={(value: boolean) => { setType(value); setCategoryList(value) }} />

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

                    <Text style={styles.inputTitle} >Anexos</Text>
                    <View style={styles.attachmentContainer} >

                        <TouchableOpacity
                            style={styles.attachmentInput}
                            onPress={() => { handleAddAttachmentFromCamera() }}
                        >
                            <AntDesign name="camerao" size={24} color="black" />
                            <Text style={styles.attachmentInputText} >Da camera</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.attachmentInput}
                            onPress={() => { handleReadCodeFromReceipt() }}
                        >
                            <AntDesign name="scan1" size={24} color="black" />
                            <Text style={styles.attachmentInputText} >Ler código NF</Text>

                        </TouchableOpacity>
                    </View>

                    {attachmentsImages && (
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
                    )}
                </ScrollView>


                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={() => { handleBack() }} >
                        <Text style={[styles.buttonText, { color: '#a8a4d3' }]} >Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button,
                    { backgroundColor: '#4643d3' }]} onPress={() => { handleAddTransaction() }} >
                        <Text style={styles.buttonText} >Adicionar</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}
export default AddTransaction;

