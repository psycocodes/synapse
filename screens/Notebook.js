import { Alert, Image, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, IconButton, useTheme } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from "react-native-linear-gradient";
import { Images } from "../constants";

const COLOR_2_btnGradA   = 'rgb(71, 10, 125)';  // (1-noiseOpacity)*Color0 | prev: 'rgb(52, 10, 89)';
const COLOR_3_btnGradB   = 'rgb(28, 4, 50)';

const NotebookScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const { path } = route.params;
    console.log(path);

    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);
    const [flashcards, setFlashcards] = useState(null);
    const [ytsugg, setYtsugg] = useState(null);


    useEffect(() => {
        // loadDatas();

        navigation.setOptions({
            // headerTintColor: 'red', // Text color for the header
            headerLeft: () => (<IconButton
                icon='arrow-left'
                onPress={navigation.goBack}
                iconColor={theme.colors.tertiary}
            />),
            // headerRight: () => (<IconButton
            //     icon="dots-vertical"
            //     // onPress={clearStorage}
            //     iconColor={theme.colors.onPrimaryContainer}
            // />)
        });
    }, [navigation]);

    // const loadDatas = async () => {
    //     try {
    //         const data = await AsyncStorage.getItem(path);
    //         const parsedData = data ? JSON.parse(data) : {};
    //         if (!('transcript' in parsedData)) return;

    //         setTranscript(parsedData.transcript);
    //         if ('summary' in parsedData) {
    //             setSummary(parsedData.summary);
    //         }
    //         if ('flashcards' in parsedData) {
    //             setFlashcards(parsedData.flashcards);
    //         }
    //         if ('ytsugg' in parsedData) {
    //             setYtsugg(parsedData.ytsugg);
    //         }
    //     } catch (e) {
    //         console.error('Failed to load data', e);
    //     }
    // };

    return (

        <LinearGradient
            colors={[theme.colors.tertiaryContainer, 'black']}
            // start={{x:0.5, y:-0.1}}
            end={{ x: 0.5, y: 0.4 }}
            style={styles.container}
        >

            <Image
                style={styles.noisyBackgroundFilter}
                source={Images.noisyBackground}
                resizeMode="contain"
            />
            <View style={styles.buttonsContainer}>
                <IconButton
                    icon="microphone-variant"
                    size={42}
                    onPress={() => navigation.navigate("RecordLecture")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.background}
                />
                <IconButton
                    icon="line-scan"
                    size={42}
                    onPress={() => navigation.navigate("ScanDocument")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.background}
                />
                <IconButton
                    icon="youtube"
                    size={42}
                    onPress={() => navigation.navigate("YoutubeTranscript")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.background}
                />
                {/* <IconButton
                    icon="file-pdf-box"
                    size={42}
                    onPress={() => navigation.navigate("UploadDocument")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.background}
                /> */}
            </View>

            <View style={styles.otherContainer}>
                {!transcript &&
                    <Text style={styles.helpText}>
                        Choose any of the above options to create transcript/content
                        {'\n'}{'\n'}
                        Then you can use it to generate Summary, Flashcards, Youtube Suggestions
                    </Text>
                }
                {transcript &&
                    <Button
                        mode="contained"
                        style={styles.button1}>
                        Transcript
                    </Button>
                }
                {transcript && summary &&
                    <Button
                        mode="contained"
                        style={styles.button1}>
                        Summary
                    </Button>
                }
                {transcript && flashcards &&
                    <Button
                        mode="contained"
                        style={styles.button1}>
                        Flashcards
                    </Button>
                }
                {transcript && ytsugg &&
                    <Button
                        mode="contained"
                        style={styles.button1}>
                        Youtube Suggestions
                    </Button>
                }
                {transcript && !summary &&
                    <Button
                        mode="outlined"
                        style={styles.button2}>
                        Generate Summary
                    </Button>
                }
                {transcript && !flashcards &&
                    <Button
                        mode="outlined"
                        style={styles.button2}>
                        Generate Flashcards
                    </Button>
                }
                {transcript && !ytsugg &&
                    <Button
                        mode="outlined"
                        style={styles.button2}>
                        Get Youtube Suggestions
                    </Button>
                }
            </View>
        </LinearGradient>
    );
};

export default NotebookScreen;

const createStyles = theme => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 5,
        paddingTop: 15,
        paddingHorizontal: 15,
    },
    otherContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 15,
        paddingTop: 40,
        paddingHorizontal: 14,
        alignItems: 'stretch',
    },
    button1: {
        marginHorizontal: 34,
    },
    button2: {
        marginHorizontal: 34,
        backgroundColor: '#99999922'
    },
    helpText: {
        color: theme.colors.onTertiary,
        paddingHorizontal: 8,
        textAlign: 'center',
    },

    
    noisyBackgroundFilter: {
        position: 'absolute',
        opacity: 0.4,
        // transform:[{scale:0.333}, {translateX:-1080}, {translateY:-2412}],
        transform:[{scale:0.4}, {translateX:-850}, {translateY:-1800}],
        resizeMode: 'stretch',
    },
});
