
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput, Alert } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const TranscriptScreen = ({ navigation, route }) => {
    const params = route.params;
    const theme = useTheme();
    const styles = createStyles(theme);

    const [editingMode, setEditingMode] = useState(false);
    const [editedTranscript, setEditedTranscript] = useState('');
    const [transcript, setTranscript] = useState(params.transcript);
    // if (!transcript) Alert.alert('Transcript loading failed!');

    const startEdit = () => {
        setEditedTranscript(transcript);
        setEditingMode(true);
    }
    const confirmEdit = () => {
        setTranscript(editedTranscript);
        setEditedTranscript('');
        setEditingMode(false);
    }
    const cancelEdit = () => {
        setEditedTranscript('');
        setEditingMode(false);
    }
    const summarize = () => {
        navigation.navigate('Summary', { transcript: transcript });
        // router.push({ pathname: '../summary', params: { transcript: transcript } });
    }
    const flashcards = () => {
        navigation.navigate('Flashcards', { transcript: transcript });
        // router.push({ pathname: '../flashcards', params: { transcript: transcript } });
    }
    const ytSuggest = () => {
        navigation.navigate('YoutubeSuggestions', { transcript: transcript });
        // router.push({ pathname: '../yt-suggest', params: { transcript: transcript } });
    }

    return (
        <View style={styles.mainView}>
            <View style={styles.containerMain}>
                {!editingMode &&
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.data}>
                            {transcript}
                        </Text>
                    </ScrollView>}
                {editingMode &&
                    <TextInput
                        style={styles.textEditor}
                        label="Edit Transcript"
                        value={editedTranscript}
                        onChangeText={setEditedTranscript}
                        multiline={true}
                        textAlignVertical='top'>
                    </TextInput>}
            </View>
            <View style={styles.containerTools}>
                {!editingMode &&
                    <Button mode="outlined" style={styles.specialButton} onPress={startEdit}>
                        Edit Transcript
                    </Button>}
                {editingMode &&
                    <View style={styles.editOptions}>
                        <Button mode="outlined" style={styles.specialButton} onPress={cancelEdit}>
                            Cancel
                        </Button>
                        <Button mode="outlined" style={styles.specialButton} onPress={confirmEdit}>
                            Confirm
                        </Button>
                    </View>
                }
                <Button mode="contained" disabled={editingMode} onPress={summarize}>
                    Summarize
                </Button>
                <Button mode="contained" disabled={editingMode} onPress={flashcards}>
                    Flashcards
                </Button>
                <Button mode="contained" disabled={editingMode} onPress={ytSuggest}>
                    Youtube video suggestions
                </Button>
            </View>
        </View>
    );
};

const createStyles = theme => StyleSheet.create({
    mainView: {
        flex: 1,
        paddingBottom: 8,
        backgroundColor: theme.colors.background,
    },
    containerMain: {
        padding: 4,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 10,
        margin: 12,
        flex: 1,
    },
    container: {
        padding: 12,
    },
    containerTools: {
        gap: 8,
        padding: 8,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 12,
    },
    data: {
        fontSize: 16,
        marginBottom: 8,
    },
    textEditor: {
        flex: 1,
        padding: 4,
        color: theme.colors.primary,
    },
    editOptions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    specialButton: {
        // borderColor: 'black',
    }
});

export default TranscriptScreen;

