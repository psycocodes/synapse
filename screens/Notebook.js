import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, IconButton, useTheme } from "react-native-paper";

const NotebookScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const { path } = route.params;
    console.log(path);

    const [transcript, setTranscript] = useState(null);
    const [summary, setSummary] = useState(null);
    const [flashcards, setFlashcards] = useState(null);
    const [ytsugg, setYtsugg] = useState(null);

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <IconButton
                    icon="microphone-variant"
                    size={42}
                    onPress={() => navigation.navigate("RecordLecture")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
                <IconButton
                    icon="line-scan"
                    size={42}
                    onPress={() => navigation.navigate("ScanDocument")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
                <IconButton
                    icon="youtube"
                    size={42}
                    onPress={() => navigation.navigate("YoutubeTranscript")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
                <IconButton
                    icon="file-pdf-box"
                    size={42}
                    onPress={() => navigation.navigate("UploadDocument")}
                    iconColor={theme.colors.tertiaryContainer}
                    containerColor={theme.colors.onSecondary}
                />
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
        </View >
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
    }
});
