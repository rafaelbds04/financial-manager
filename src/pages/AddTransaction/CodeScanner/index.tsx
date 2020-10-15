import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import styles from './styles';

import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../../components/PageHeader';
import api from '../../../services/api';
import { showMessage } from "react-native-flash-message";
import { catchErrorMessage } from '../../../services/utils';

interface CodeScannerProps {
  toggleScannerVisible?: Function
}

export interface Attacment {
  key?: string,
  url?: string | null,
  id?: number
}

export interface Receipt {
  emitter?: string,
  totalAmount?: number
  emittedDate?: string
  error?: string,
  attachment?: Attacment
}

const CodeScanner: React.FC<CodeScannerProps> = () => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    if (scanned) return;
    setScanned(true);
    Vibration.vibrate(500)

    //Check with code readed is valid 
    if (!(data.includes('fazenda.rj.gov.br'))) {
      showMessage({
        type: "danger",
        message: 'NF inválida',
        description: 'Esse código não é aceito.',
        duration: 5000
      })
      handleReturnToTransaction();
      return
    }

    //Sending receipt code to server
    try {
      showMessage({
        message: 'Pegando NF',
        type: "info",
        autoHide: false
      })
      const { response, statusCode } = await api.getReceipt(data);

      //If was error, show message and return to last screen
      if (response.error || statusCode !== 200) {
        const errorMsg = response.error || response.message;
        catchErrorMessage(errorMsg!);

        response.totalAmount ? handleReturnToTransaction(
          { totalAmount: response.totalAmount })
          : handleReturnToTransaction();
        return
      }
      showMessage({
        message: 'NF obtida com sucesso!',
        type: 'success'
      })
      handleReturnToTransaction(response);

    } catch (error) {
      catchErrorMessage(error);
      handleReturnToTransaction();
      return
    }
  };


  async function handleReturnToTransaction(receipt?: Receipt) {
    navigation.navigate('AddTransaction', { receipt })
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      < PageHeader title={'Digitalize o código da NF'} />
      <View style={styles.contaier}>
        <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={{ flex: 1 }}>
          <View style={styles.scanContainer}>
          </View>
        </BarCodeScanner>
      </View>
    </>
  );

}

export default CodeScanner;

