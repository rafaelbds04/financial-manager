import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, ScrollView, FlatList, Modal } from 'react-native'
import PageHeader from '../../components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text'
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
import { catchErrorMessage } from '../../services/utils';
import accounting from 'accounting';
import styles from './styles';

interface Params {
    attachmentImage?: string;
    receipt?: Receipt;
    type?: string;
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
    const [type, setType] = useState(true);
    const [date, setDate] = useState(currentDate);
    const [dueDate, setDueDate] = useState(currentDate);
    const [selectedCategory, setSelectedCategory] = useState<string | number>('0');
    const [categoriesItems, setCategoriesItems] = useState<CategorySelectorItem[]>([
        { label: 'Carregando', value: '0' }
    ]);

    useEffect(() => { (routeParams?.type == 'revenue') && setType(false) }, [])

    useEffect(() => {
        (async () => {
            try {
                const categoryType = type ? CategoryType.EXPENSE : CategoryType.REVENUE
                const response = await api.getCategoriesByType(categoryType);
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
        })();
    }, [type]);

    useEffect(() => {
        const images: IImageInfo[] = []
        if (routeParams?.attachmentImage) {
            setCapturedAttachment(routeParams?.attachmentImage);
            images.push({
                url: routeParams?.attachmentImage
            })
        }

        if (routeParams?.receipt) {
            autoFillFromReceipt(routeParams?.receipt);
            if (!routeParams?.receipt?.attachment?.key) return
            const imageUri = routeParams?.receipt?.attachment?.url;
            imageUri && images.push({ url: imageUri });
        }

        setAttachmentsImages(images);
    }, [routeParams?.attachmentImage, routeParams?.receipt]);


    function handleBack() {
        navigation.goBack();
    }

    function handleAddAttachmentFromCamera() {
        navigation.navigate('AttacmentCamera');
    }

    function handleReadCodeFromReceipt() {
        navigation.navigate('CodeScanner');
    }

    function handleChangeCategory(item: CategorySelectorItem) {
        setSelectedCategory(item.value);
    }

    function autoFillFromReceipt(data: Receipt) {
        const { emitter, emittedDate, totalAmount, attachment } = data;
        emitter && setName(emitter);
        totalAmount && setAmount(accounting.formatMoney(Number(data.totalAmount), {
            decimal: ',',
            thousand: '.',
            precision: 2,
            symbol: 'R$'
        }).toString());
        emittedDate && setDate(new Date(emittedDate));
        attachment && setReceiptAttachment(attachment);

    }

    async function handleAddTransaction() {
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
            showMessage({
                message: 'Error',
                description: validate.message,
                type: 'danger',
                duration: 4000
            })
            return
        }

        //Serialize obj to formdata
        const formData: FormData = serialize(transactionInfos)
        //if exist receipt send with form
        receiptAttachment?.id && formData
            .append('receiptAttachment', receiptAttachment?.id.toString())

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
            if (response.statusCode != 201) {
                throw response.message
            }
            showMessage({
                message: 'Transação criada com sucesso!',
                type: 'success'
            })
            navigation.reset({
                routes: [{ name: 'Home' }]
            })
        } catch (error) {
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

                    <View style={styles.inputContainer} >
                        <Text style={styles.inputTitle}>Valor</Text>
                        <TextInputMask
                            type={'money'}
                            style={styles.input}
                            placeholder="Valor"
                            value={amount}
                            onChangeText={(text) => setAmount(text)}
                        />
                    </View>

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
                        <Text style={[styles.buttonText, { color: '#a8a4d3' }]} >Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button,
                    { backgroundColor: '#4643d3' }]} onPress={() => { handleAddTransaction() }} >
                        <Text style={styles.buttonText} >Add</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}
export default AddTransaction;

