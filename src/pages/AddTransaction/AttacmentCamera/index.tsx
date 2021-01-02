import React, { useState, useEffect, useRef, createRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import styles from './styles';

import { Camera, CameraCapturedPicture } from 'expo-camera';
import PageHeader from '../../../components/PageHeader';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

interface AttacmentCameraProps {
}

const AttacmentCamera: React.FC<AttacmentCameraProps> = () => {

    const navigation = useNavigation();

    const cameraRef = useRef<Camera>(null);
    const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | any>(null);

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    async function handleCapture() {
        if (cameraRef) {
            const data = await cameraRef.current?.takePictureAsync({
                quality: 0.4,
                base64: true
            })
            setCapturedImage(data?.uri)
        }
    }

    async function handleSelectAttachment() {
        const documnet = await DocumentPicker.getDocumentAsync()
        if (documnet.type === 'success') {
            navigation.navigate('AddTransaction', { attachmentImage: documnet.uri })
        }
    }

    async function handleAddAttacment() {
        navigation.navigate('AddTransaction', { attachmentImage: capturedImage })
    }

    return (
        <>
            {!capturedImage ? (
                <>
                    < PageHeader title={'Adicionar anexo da câmera'}
                        additionalIcon={
                            <TouchableOpacity onPress={() => handleSelectAttachment()}>
                                <Entypo name="attachment" size={20} color="white" />
                            </TouchableOpacity>} />
                    <View style={styles.contaier}>
                        <Camera style={{ flex: 1 }}
                            type={type}
                            ref={cameraRef}

                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row',
                                }}>

                                <View style={styles.footer}>
                                    <TouchableOpacity style={styles.captureButton}
                                        onPress={() => { handleCapture() }} >
                                        <Text style={styles.buttonText} >Capturar</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </Camera>
                    </View>
                </>)
                : (
                    <>
                        < PageHeader title={'Preview'} />
                        <View style={styles.contaier}>
                            <Image style={{ flex: 1 }}
                                source={{ uri: capturedImage }} />
                            <View style={styles.previewFooter}>
                                <TouchableOpacity style={styles.button}
                                    onPress={() => { setCapturedImage(null) }} >
                                    <Text style={[styles.buttonText,
                                    { color: '#fff' }]} >Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button,
                                { backgroundColor: '#37b55a' }]}
                                    onPress={() => { handleAddAttacment() }} >
                                    <Text style={styles.buttonText} >Adiconar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </>
                )
            }

        </>);
}

export default AttacmentCamera;

