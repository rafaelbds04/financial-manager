import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native'

import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction/index';
import AttacmentCamera from './pages/AddTransaction/AttacmentCamera';
import Preload from './pages/Preload/index';
import SingIn from './pages/SingIn/index';

const AppStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator
                // initialRouteName='Preload'
                initialRouteName='Home'
                headerMode='none'
                screenOptions={{
                    cardStyle: {
                        backgroundColor: '#fff'
                    }
                }}
            >
                <AppStack.Screen name='Preload' component={Preload} />
                <AppStack.Screen name='SingIn' component={SingIn} />
                <AppStack.Screen name='Home' component={Home} />
                <AppStack.Screen name='AddTransaction' component={AddTransaction} />
                <AppStack.Screen name='AttacmentCamera' component={AttacmentCamera} />

                

            </AppStack.Navigator>

        </NavigationContainer>
    );
}

export default Routes;