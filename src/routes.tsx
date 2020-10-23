import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native'

import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction/index';
import AttacmentCamera from './pages/AddTransaction/AttacmentCamera';
import Preload from './pages/Preload/index';
import SingIn from './pages/SingIn/index';
import CodeScanner from './pages/AddTransaction/CodeScanner';
import TransactionDetail from './pages/TransactionDetail';
import EditTransaction from './pages/EditTransaction';
import Extract from './pages/Extract';

const AppStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator
                initialRouteName='Preload'
                // initialRouteName='Home'
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
                <AppStack.Screen name='TransactionDetail' component={TransactionDetail} /> 
                <AppStack.Screen name='AttacmentCamera' component={AttacmentCamera} />
                <AppStack.Screen name='CodeScanner' component={CodeScanner} />
                <AppStack.Screen name='EditTransaction' component={EditTransaction} />
                <AppStack.Screen name='Extract' component={Extract} />

                

            </AppStack.Navigator>

        </NavigationContainer>
    );
}

export default Routes;