import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native'

import Home from './pages/Home';
import AddTransacion from './pages/AddTransaction/index';

const AppStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator
                headerMode='none'
                screenOptions={{
                    cardStyle: {
                        backgroundColor: '#fff'
                    }
                }}
            >
                <AppStack.Screen name='Home' component={Home} />
                <AppStack.Screen name='AddTransacion' component={AddTransacion} />

            </AppStack.Navigator>

        </NavigationContainer>
    );
}

export default Routes;