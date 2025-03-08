import { Alert, Image, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, IconButton, useTheme } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from "react-native-linear-gradient";
import { Images } from "../constants";

const COLOR_2_btnGradA   = 'rgb(71, 10, 125)';  // (1-noiseOpacity)*Color0 | prev: 'rgb(52, 10, 89)';
const COLOR_3_btnGradB   = 'rgb(28, 4, 50)';

const CustomButton1 = ({ innerText, onPress }) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    
    return (
        <Button
            mode="contained"
            style={styles.button1}
            buttonColor={theme.colors.tertiaryContainer}
            textColor={theme.colors.surfaceVariant}
            onPress={onPress}
        >
            {innerText}
        </Button>
    );
};
const CustomButton2 = ({ innerText, onPress }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <Button
            mode="outlined"
            style={styles.button2}
            textColor={theme.colors.tertiaryContainer}
            onPress={onPress}
        >
            {innerText}
        </Button>
    );
};

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
        loadDatas();

        navigation.setOptions({
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

    const loadDatas = async () => {
        try {
            const _trans = await AsyncStorage.getItem(path+'/transcript');
            // const parsedData = data ? JSON.parse(data) : {};
            // if (!('transcript' in parsedData)) return;
            if (_trans) setTranscript(_trans);
            // if ('summary' in parsedData) {
            //     setSummary(parsedData.summary);
            // }
            // if ('flashcards' in parsedData) {
            //     setFlashcards(parsedData.flashcards);
            // }
            // if ('ytsugg' in parsedData) {
            //     setYtsugg(parsedData.ytsugg);
            // }
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    const recordLecture = () => {
        navigation.navigate("RecordLecture", { title: route.params.title || 'Untitled', path: route.params.path});
    }; 
    const scanDocument = () => {
        navigation.navigate("ScanDocument", { title: route.params.title || 'Untitled', path: route.params.path });
    };
    const youtubeTranscript = () => {
        navigation.navigate("YoutubeTranscript", { title: route.params.title || 'Untitled', path: route.params.path });
    };

    const openTranscript = () => {
        // navigation.navigate("  ", { title: route.params.title || 'Untitled', path: route.params.path });
        navigation.navigate('Transcript', { path: route.params.path, title: route.params.title, transcript: transcript, load: true });
    };

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
                    onPress={recordLecture}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.background}
                />
                <IconButton
                    icon="line-scan"
                    size={42}
                    onPress={scanDocument}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.background}
                />
                <IconButton
                    icon="youtube"
                    size={42}
                    onPress={youtubeTranscript}
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
                {/* {!transcript && */}
                    <Text style={styles.helpText}>
                        Choose any of the above options to create transcript/content
                        {'\n'}{'\n'}
                        Then you can use it to generate Summary, Flashcards, Youtube Suggestions
                    </Text>
                { }
                {transcript && <CustomButton1 innerText="Open Transcript" onPress={openTranscript}/>}
                {transcript && summary &&
                    <CustomButton1 innerText="Summary" onPress={openTranscript}/>
                }
                {transcript && flashcards &&
                    <CustomButton1 innerText="Flashcards" onPress/>
                }
                {transcript && ytsugg &&
                    <CustomButton1 innerText="Youtube Suggestions" onPress/>
                }
                {transcript && !summary &&
                    <CustomButton2 innerText="Generate Summary" onPress/>
                }
                {transcript && !flashcards &&
                    <CustomButton2 innerText="Generate Flashcards" onPress/>
                }
                {transcript && !ytsugg &&
                    <CustomButton2 innerText="Generate Youtube Suggestions" onPress/>
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
        backgroundColor: '#99774433',
        borderColor:theme.colors.onTertiary,
    },
    helpText: {
        color: theme.colors.tertiaryContainer,
        paddingHorizontal: 8,
        textAlign: 'center',
        marginBottom: 20,
    },

    
    noisyBackgroundFilter: {
        position: 'absolute',
        opacity: 0.4,
        // transform:[{scale:0.333}, {translateX:-1080}, {translateY:-2412}],
        transform:[{scale:0.4}, {translateX:-850}, {translateY:-1800}],
        resizeMode: 'stretch',
    },
});
