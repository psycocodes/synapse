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
import LearnFurtherScreen from './screens/products/LearnFurther';

import FlashcardSessionScreen from './screens/fsessions/Session';

const Stack = createStackNavigator();
const DefaultTheme = MD3DarkTheme;
DefaultTheme.colors = {
    ...MD3DarkTheme.colors,
    primary:            "rgb(220, 184, 255)",
    onPrimary:          "rgb(71, 12, 122)",
    primaryContainer:   "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",
    primarySaturated:   'rgb(119, 17, 209)',

    secondary:          "rgb(193, 193, 218)",
    onSecondary:        "rgb(46, 44, 63)",
    secondaryContainer: "rgb(67, 67, 87)",
    onSecondaryContainer:"rgb(223, 221, 246)",
    secondarySaturated: "rgb(95, 92, 125)",
    secondaryDark:      "rgb(33, 33, 42)",
    
    tertiary:           'rgb(255, 227, 188)',
    onTertiary:         'rgb(148, 99, 0)',
    tertiaryContainer:  'rgb(255, 169, 47)',
    onTertiaryContainer: 'rgb(224, 210, 184)',
    
    error:              'rgb(255, 180, 171)',
    onError:            'rgb(105, 0, 5)',
    errorContainer:     'rgb(147, 0, 10)',
    onErrorContainer:   'rgb(255, 180, 171)',

    background:         'rgb(0,0,0)',
    onBackground:       'rgb(231, 225, 229)',
    surface:            'rgb(29, 29, 29)',
    onSurface:          'rgb(231, 225, 229)',
    surfaceVariant:     'rgb(45, 44, 46)',
    onSurfaceVariant:   'rgb(204, 196, 206)',

    outline:            'rgb(150, 142, 152)',
    outlineVariant:     'rgb(74, 69, 78)',
    shadow:             'rgb(0, 0, 0)',
    scrim:              'rgb(0, 0, 0)',
    inverseSurface:     'rgb(231, 225, 229)',
    inverseOnSurface:   'rgb(50, 47, 51)',
    inversePrimary:     'rgb(120, 69, 172)',
    elevation: {
        level0: 'transparent',
        level1: 'rgb(39, 35, 41)',
        level2: 'rgb(44, 40, 48)',
        level3: 'rgb(50, 44, 55)',
        level4: 'rgb(52, 46, 57)',
        level5: 'rgb(56, 49, 62)'
    },
    surfaceDisabled:    'rgba(231, 225, 229, 0.12)',
    onSurfaceDisabled:  'rgba(231, 225, 229, 0.38)',
    backdrop:           'rgba(51, 47, 55, 0.4)'
}

export default function App() {
    return (
        <PaperProvider theme={DefaultTheme}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" screenOptions={{
                    presentation: 'modal',
                    headerStyle: {
                        backgroundColor: DefaultTheme.colors.background,
                        // elevation: 0,
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
                    <Stack.Screen name="LearnFurther" component={LearnFurtherScreen} />

                    <Stack.Screen name="FlashcardSession" component={FlashcardSessionScreen} />

                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
