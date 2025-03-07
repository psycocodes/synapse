import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput, useTheme } from 'react-native-paper';
import ItemType from '../constants/ItemType';
import { useNavigation } from '@react-navigation/native';


const createStyles = (theme) => StyleSheet.create({
    title: {
        color: theme.colors.onPrimaryContainer,
        marginTop: 25,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'column',
        marginBottom: 24,
        borderColor: 'red',
        paddingHorizontal: 32,
    },
    button: {
        alignItems: 'flex-start',
        borderColor: 'red',
        flexDirection: 'row',
        marginBottom: 6,
    },
    buttonLabel: {
        textAlign: 'left',
        width: '80%',
        fontSize: 20,
        transform: [{scale: 0.8}, {translateX: -20}, {translateY: 2}],
    },
    input: {
        backgroundColor: 'transparent'
    },
    foundText: {
        color: theme.colors.primary,
        padding: 4,
    }
});

export default AddNewDialog = forwardRef(function ({ onDone }, ref) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [name, setName] = useState('');
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        ref.current = {};
        ref.current.createDialog = (withType) => {
            setName('');
            setType(withType);
            setVisible(true);
        }
    }, [ref]);


    const hideDialog = () => {
        setVisible(false);
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{backgroundColor: theme.colors.background, borderRadius:15,}}>
                
                {type === null ? (<View style={styles.buttonsContainer}>
                    <Button
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="folder-open"
                        textColor={theme.colors.onTertiaryContainer}
                        onPress={() => setType(ItemType.GROUP)}>Group</Button>
                    <Button
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="note-text"
                        textColor={theme.colors.onTertiaryContainer}
                        onPress={() => setType(ItemType.NOTEBOOK)}>Notebook</Button>
                    <View style={{ height: 0, borderBottomWidth: 1, borderColor: theme.colors.onTertiaryContainer, marginBottom: 6, }} />
                    <Button
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="microphone-variant"
                        onPress={() => {
                            navigation.navigate("RecordLecture")
                            hideDialog();
                        }}>Record</Button>
                    <Button
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="line-scan"
                        onPress={() => {
                            navigation.navigate("ScanDocument")
                            hideDialog();
                        }}>Scan</Button>
                    <Button
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="youtube"
                        onPress={() => {
                            navigation.navigate("YoutubeTranscript")
                            hideDialog();
                        }}>Link</Button>
                    <Button
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="file-pdf-box"
                        onPress={() => {
                            navigation.navigate("UploadDocument")
                            hideDialog();
                        }}>Upload</Button>
                </View>) : (<>
                    <Dialog.Title style={styles.title}>{'Add new ' + (type ? type : '')}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            style={styles.input}
                            mode={'outlined'}
                            label="Enter name"
                            defaultValue={name}
                            onChangeText={setName}
                        />
                    </Dialog.Content>
                    <Dialog.Actions style={{ marginBottom: -10}}>
                        <Button onPress={() => {
                            onDone(name, type);
                            hideDialog();
                        }}>Ok</Button>
                        <Button onPress={hideDialog}>Cancel</Button>
                    </Dialog.Actions>
                </>)}
            </Dialog>
        </Portal>
    );
});