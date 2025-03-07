import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

// Importing Screens
import WelcomeScreen from './screens/Welcome';
import HomeScreen from './screens/Home';
import NotebookScreen from './screens/Notebook';
import TranscriptScreen from './screens/Transcript';
import RecordLectureScreen from './screens/tools/RecordLecture';
import FlashcardSessionScreen from './screens/fsessions/Session';
import YoutubeTranscriptScreen from './screens/tools/YtTranscript';

const Stack = createStackNavigator();
const DefaultTheme = MD3DarkTheme;

DefaultTheme.colors = {
    ...MD3DarkTheme.colors,
    background: '#111',
    surface: '#1d1d1d',
    surfaceVariant: '#2d2c2e',
    onTertiary: '#946300',
    tertiaryContainer: '#eb9d02',
}

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
                    <Stack.Screen name="Notebook" component={NotebookScreen} />
                    <Stack.Screen name="RecordLecture" component={RecordLectureScreen} />
                    <Stack.Screen name="Transcript" component={TranscriptScreen} />
                    <Stack.Screen name="FlashcardSession" component={FlashcardSessionScreen} />
                    <Stack.Screen name="YoutubeTranscript" component={YoutubeTranscriptScreen} />
                    
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}