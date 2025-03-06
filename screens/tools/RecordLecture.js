import axios from "axios";
import { ActivityIndicator, Modal, Portal, Button, Text, TextInput, useTheme, IconButton } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
    addSpeechRecognitionListener,
    supportsRecording,
    getSupportedLocales,
    androidTriggerOfflineModelDownload
} from "expo-speech-recognition";

import VolumeMeter from "../../components/VolumeMeter";



// import { Platform } from 'react-native';
// const IS_LOWER_API = parseInt(Platform.constants['Release']) <= 12;
const IS_LOWER_API = !supportsRecording();
const PREFERRED_LOCALE = 'en-IN';

const ensureLocalePresent = async (setLocalePresent) => {
    if (IS_LOWER_API) return;

    const onError1 = err => console.error("Error getting supported locales:", err);
    const onError2 = err => console.log("Failed to download en-IN offline model!", err.message);

    const supportedLocales = await getSupportedLocales().catch(onError1);

    if (supportedLocales.installedLocales.includes(PREFERRED_LOCALE)) {
        setLocalePresent(true);
        return;
    }
    else if (!supportedLocales.locales.includes(supportedLocales.locales)) {
        return;
    }

    const result = await androidTriggerOfflineModelDownload({ locale: PREFERRED_LOCALE }).catch(onError2);

    switch (result.status) {
        case "opened_dialog":
            // On Android 13, the status will be "opened_dialog" indicating that the model download dialog was opened.
            console.log("en-IN offline model download dialog opened.");
            break;
        case "download_success":
            // On Android 14+, model was succesfully downloaded.
            console.log("en-IN offline model downloaded successfully!");
            setLocalePresent(true);
            return;
        case "download_canceled":
            // On Android 14+, the download was canceled by a user interaction.
            console.log("en-IN offline model download was canceled.");
            break;
    }
}

async function sendForTranscription(audioUrl, setter) {
    try {
        //const FILE_URL = 'https://assets.editor.p5js.org/5f5b9204e713f0002451fa37/d865c743-da58-4bdc-8911-02a8a0d52330.mp3';

        const FILE_URL = audioUrl;
        const transcriptionResponse = await axios.post(
            "https://api.assemblyai.com/v2/transcript",
            {
                audio_url: FILE_URL,
            },
            {
                headers: {
                    authorization: process.env.ASSEMBLY_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        const transcriptId = transcriptionResponse.data.id;
        console.log("Transcription requested, ID:", transcriptId);

        // Step 3: Poll for transcription result
        let isTranscribed = false;
        let transcriptData;

        while (!isTranscribed) {
            const transcriptResult = await axios.get(
                `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                {
                    headers: {
                        authorization: process.env.ASSEMBLY_API_KEY,
                    },
                }
            );

            if (transcriptResult.data.status === "completed") {
                isTranscribed = true;
                transcriptData = transcriptResult.data.text;
                setter(transcriptData);
                console.log("Transcription completed:", transcriptData);
            } else if (transcriptResult.data.status === "failed") {
                console.error("Transcription failed:", transcriptResult.data.error);
                break;
            } else {
                console.log("Transcription in progress...");
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
            }
        }

        return transcriptData;
    } catch (error) {
        console.error("Error during transcription:", error);
    }
}

export default function RecordLectureScreen({ navigation }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [loading, setLoading] = useState(false);

    const [transcribeFromUrl, setTranscribeFromUrl] = useState(false);
    const [audioUrl, setAudioUrl] = useState(""); // State for audio URL

    const [recognizing, setRecognizing] = useState(false);
    const [shouldRecognize, setShouldRecognize] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [preTranscript, setPreTranscript] = useState("");
    const [localePresent, setLocalePresent] = useState(false);


    const handleTranscriptionFromUrl = async () => {
        if (audioUrl) {
            setLoading(true);
            const data = await sendForTranscription(audioUrl, setTranscript);
            setLoading(false);
            navigation.navigate('Transcript', { transcript: data });
            // router.push({ pathname: "../transcript", params: { transcript: data } });
        } else {
            console.error("Please enter a valid audio URL");
        }
    };

    useEffect(() => {
        ensureLocalePresent(setLocalePresent);
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<IconButton
                icon={transcribeFromUrl ? "microphone" : "link"}
                iconColor={theme.colors.onPrimaryContainer}
                disabled={transcript !== '' || shouldRecognize || recognizing}
                onPress={() => setTranscribeFromUrl(!transcribeFromUrl)}
            />)
        });
    }, [transcript, shouldRecognize, recognizing, transcribeFromUrl]);

    useEffect(() => {
        if (IS_LOWER_API) return;

        const resultListener = addSpeechRecognitionListener("result", (event) => {
            // console.log(event.isFinal, event.results[0]);
            const resultTrans = event.results[0]?.transcript;
            if (event.isFinal) {
                setTranscript(transcript + resultTrans);
                setPreTranscript("");
            }
            else {
                setPreTranscript(resultTrans);
            }
        });
        return resultListener.remove;
    }, [transcript]);

    useEffect(() => {
        if (false === IS_LOWER_API) return;

        const resultListener = addSpeechRecognitionListener("result", (event) => {
            // console.log(event.isFinal, event.results[0]);
            const resultTrans = event.results[0]?.transcript;
            const isFinal = (preTranscript === resultTrans) || (preTranscript.length > resultTrans.length + 1);

            // console.log(preTranscript.length, resultTrans.length, resultTrans);

            if (isFinal) {
                const prefix = transcript ? transcript + ' ' : '';
                setTranscript(prefix + preTranscript.trim() + '.');
                setPreTranscript("");
            }
            else {
                setPreTranscript(' ' + resultTrans);
            }
        });
        return resultListener.remove;
    }, [transcript, preTranscript]);

    useEffect(() => {
        const errorListener = addSpeechRecognitionListener("error", (event) => {
            setTranscript(transcript + preTranscript);
            setPreTranscript("");
            console.log("error code:", event.error, "error messsage:", event.message);
        });
        return errorListener.remove;
    }, [transcript, preTranscript]);

    useSpeechRecognitionEvent("start", () => setRecognizing(true));
    useSpeechRecognitionEvent("end", () => setRecognizing(false));

    const handleStart = async () => {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
            console.warn("Permissions not granted", result);
            Alert.alert("Permissions not granted", result.toString());
            return;
        }
        setShouldRecognize(true);

        const speechOptions = {
            // if present, lang: "en-IN",
            interimResults: true,
            maxAlternatives: 1,
            continuous: true,
            requiresOnDeviceRecognition: true,
            addsPunctuation: true,
            androidIntentOptions: {
                EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000
                // if android 13+, EXTRA_MASK_OFFENSIVE_WORDS = false
            },
            contextualStrings: ["AcadZ"],
            volumeChangeEventOptions: {
                enabled: true,
                intervalMillis: 300,
            },
        };

        if (localePresent)
            speechOptions.lang = PREFERRED_LOCALE;

        if (!IS_LOWER_API)
            speechOptions.androidIntentOptions.EXTRA_MASK_OFFENSIVE_WORDS = false;

        // speechOptions.recordingOptions = {
        //     persist: true,
        //     outputDirectory: undefined,
        //     outputFileName: "recording.wav",
        // };

        // Start speech recognition
        ExpoSpeechRecognitionModule.start(speechOptions);
    };
    const handlePause = async () => {
        setShouldRecognize(false);
        ExpoSpeechRecognitionModule.stop();
        if (IS_LOWER_API) {
            const prefix = transcript ? transcript + ' ' : '';
            setTranscript(prefix + preTranscript.trim() + '.');
            setPreTranscript("");
        }
    }
    const handleDone = async () => {
        navigation.navigate('Transcript', { transcript: transcript });
    }

    return (
        <View style={styles.container}>
            {transcribeFromUrl ? (
                <>
                    <TextInput
                        mode='outlined'
                        value={audioUrl}
                        onChangeText={setAudioUrl}
                        label="Enter audio file URL"
                        style={styles.urlText}
                    />
                    <Button mode='contained' onPress={handleTranscriptionFromUrl}>
                        Start Transcription from URL
                    </Button>
                </>
            ) : (
                <>
                    <ScrollView style={styles.transcriptContainer}>
                        <Text>{transcript + preTranscript}</Text>
                    </ScrollView>
                    <View style={styles.bottomSection}>

                        <VolumeMeter style={styles.volumeMeter} />

                        <View style={styles.bottomButtonsContainer}>
                            {!recognizing ? (
                                <Button
                                    mode="contained"
                                    icon="play"
                                    style={styles.bottomButtons}
                                    onPress={handleStart}
                                    disabled={shouldRecognize}>
                                    {transcript === '' ? 'Start' : 'Resume'}
                                </Button>
                            ) : (
                                <Button
                                    mode="contained"
                                    icon="pause"
                                    style={styles.bottomButtons}
                                    onPress={handlePause}
                                    disabled={!shouldRecognize}>
                                    Pause
                                </Button>
                            )}
                            <Button
                                mode="contained"
                                icon="check"
                                style={styles.bottomButtons}
                                onPress={handleDone}
                                disabled={recognizing || shouldRecognize || transcript === ''}>
                                Done
                            </Button>
                        </View>
                    </View>
                </>
            )
            }

            <Portal>
                <Modal
                    visible={loading}
                    dismissable={false}
                    contentContainerStyle={styles.modal}
                >
                    <ActivityIndicator animating={true} size="large" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </Modal>
            </Portal>
        </View>
    );
}

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 8,
    },
    urlText: {
        marginBottom: 16,
        marginHorizontal: 8,
    },

    transcriptContainer: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 10,
        padding: 8,
    },
    bottomSection: {
        paddingBottom: 25,
    },
    volumeMeter: {
        // marginTop: 15,
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 8,
    },
    bottomButtons: {
        flex: 1,
    },

    modal: {
        backgroundColor: theme.colors.background,
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
});