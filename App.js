import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

// Importing Screens
import WelcomeScreen from './screens/Welcome';
import HomeScreen from './screens/Home';
import NotebookScreen from './screens/Notebook';

import RecordLectureScreen from './screens/tools/RecordLecture';
import ScanDocumentScreen from './screens/tools/ScanDoc';
import UploadDocumentScreen from './screens/tools/UploadDoc';
import YoutubeTranscriptScreen from './screens/tools/YtTranscript';

import TranscriptScreen from './screens/Transcript';

import SummaryScreen from './screens/products/Summary';
import FlashcardsScreen from './screens/products/Flashcards';
import YoutubeSuggestionsScreen from './screens/products/YtSuggestions';

import FlashcardSessionScreen from './screens/fsessions/Session';

const Stack = createStackNavigator();
const DefaultTheme = MD3DarkTheme;
DefaultTheme.colors = {
    ...MD3DarkTheme.colors,
    primary:            "rgb(220, 184, 255)",
    onPrimary:          "rgb(71, 12, 122)",
    primaryContainer:   "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",
    secondary:          "rgb(208, 193, 218)",
    onSecondary:        "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer:"rgb(237, 221, 246)",
    
    background:         'rgb(17, 17, 17)',
    surface:            'rgb(29, 29, 29)',
    surfaceVariant:     'rgb(45, 44, 46)',
    tertiary:           'rgb(255, 227, 188)',
    onTertiary:         'rgb(148, 99, 0)',
    tertiaryContainer:  'rgb(255, 169, 47)',
    onTertiaryContainer:'rgb(224, 210, 184)',
}


// "tertiary": "rgb(128, 81, 88)", 
// "onTertiary": "rgb(255, 255, 255)",
// "tertiaryContainer": "rgb(255, 217, 221)",
// "onTertiaryContainer": "rgb(50, 16, 23)",

export default function App() {
    return (
        <PaperProvider theme={DefaultTheme}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" screenOptions={{
                    presentation: 'modal',
                    headerStyle: {
                        backgroundColor: 'black',//DefaultTheme.colors.primaryContainer,
                        elevation: 0,
                    },
                    headerTintColor: DefaultTheme.colors.onPrimaryContainer, // Text color for the header
                }}>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Notebook" component={NotebookScreen} options={{headerTintColor: DefaultTheme.colors.tertiary}}/>

                    <Stack.Screen name="RecordLecture" component={RecordLectureScreen} />
                    <Stack.Screen name="ScanDocument" component={ScanDocumentScreen} />
                    <Stack.Screen name="YoutubeTranscript" component={YoutubeTranscriptScreen} />
                    <Stack.Screen name="UploadDocument" component={UploadDocumentScreen} />

                    <Stack.Screen name="Transcript" component={TranscriptScreen} />
                    <Stack.Screen name="Summary" component={SummaryScreen} />
                    <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
                    <Stack.Screen name="YoutubeSuggestions" component={YoutubeSuggestionsScreen} />

                    <Stack.Screen name="FlashcardSession" component={FlashcardSessionScreen} />

                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
