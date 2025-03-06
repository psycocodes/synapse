import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

// Importing Screens
import WelcomeScreen from './screens/Welcome';
import HomeScreen from './screens/Home';

const Stack = createStackNavigator();
const DefaultTheme = MD3DarkTheme;

export default function App() {
    return (
        <PaperProvider theme={DefaultTheme}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" screenOptions={{
                    presentation: 'modal',
                    headerStyle: {
                        backgroundColor: DefaultTheme.colors.primaryContainer,
                        elevation: 0,
                    },
                    headerTintColor: DefaultTheme.colors.onPrimaryContainer, // Text color for the header
                }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />

                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}