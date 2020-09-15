import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppLoading } from 'expo';
import { SafeAreaView, Text, View } from 'react-native';

/**
 * Colors
 * primary #4643d3
 * primary second #6664d4
 * Fullbg #ebecf2
 * White labels #fff
 * Reverse #f58218
 */

import { Roboto_400Regular,Roboto_300Light , Roboto_500Medium, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <>
      <StatusBar style="auto" backgroundColor="transparent" translucent />
      <Routes />
    </>
  );

}
