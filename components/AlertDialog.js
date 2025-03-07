import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, useTheme } from 'react-native-paper';


const createStyles = (theme) => StyleSheet.create({
    title: {
        color: theme.colors.onPrimaryContainer,
        marginTop: 25,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    content: {
        color: theme.colors.primary,
        paddingHorizontal: 6,
    },
    buttonLabel: {
        textAlign: 'left',
        width: '80%',
        fontSize: 20,
        transform: [{scale: 0.8}, {translateX: -20}, {translateY: 2}],
    },
});

export default AlertDialog = forwardRef(function ({}, ref) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [state, setState] = useState({title:'Defaule Title', content:'Default Content'});
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        ref.current = {};
        ref.current.createDialog = (title, content) => {
            setState({title, content});
            setVisible(true);
        }
    }, [ref]);


    const hideDialog = () => {
        setVisible(false);
    };

    return (<Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: theme.colors.background, borderRadius: 15, }}>
            <Dialog.Title style={styles.title}>{state.title}</Dialog.Title>
            <Dialog.Content>
                <Text style={styles.content}>
                    {state.content}
                </Text>
            </Dialog.Content>
            <Dialog.Actions style={{ marginBottom: -10 }}>
                <Button onPress={() => {
                    // onDone(name, type);
                    hideDialog();
                }}>Ok</Button>
                {/* <Button onPress={hideDialog}>Cancel</Button> */}
            </Dialog.Actions>
        </Dialog>
    </Portal>);
});