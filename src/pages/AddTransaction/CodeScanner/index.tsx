import React, { useState, useEffect } from 'react';
import { View, Text, Vibration } from 'react-native';
import styles from './styles';

import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../../components/PageHeader';
import { showMessage } from "react-native-flash-message";
import moment from 'moment';
import { Camera } from 'expo-camera';

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
  attachment?: Attacment,
  receiptKey?: string
}

const CodeScanner: React.FC<CodeScannerProps> = () => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

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
    handleReturnToTransaction({ scannedAt: moment().toISOString(), code: data });
  };


  async function handleReturnToTransaction(receiptCode?: { scannedAt?: string, code?: string }) {
    navigation.navigate('AddTransaction', { receiptScan: receiptCode })
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
        <Camera onBarCodeScanned={handleBarCodeScanned} style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          flashMode={flashMode}
          onCameraReady={() => {
            setFlashMode(Camera.Constants.FlashMode.torch);
          }}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}>
          <View style={styles.scanContainer}>
          </View>
        </Camera>
      </View>
    </>
  );

}

export default CodeScanner;

