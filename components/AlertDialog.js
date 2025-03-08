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
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: -10,
    }
});

export default AlertDialog = forwardRef(function ({}, ref) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [state, setState] = useState({
        title: 'Default Title', 
        content: 'Default Content',
        buttons: []
    });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        ref.current = {};
        ref.current.createDialog = (title, content, buttons = []) => {
            setState({
                title, 
                content, 
                buttons: buttons && buttons.length > 0 ? buttons : []
            });
            setVisible(true);
        }
    }, [ref]);

    const hideDialog = () => {
        setVisible(false);
    };

    return (
        <Portal>
            <Dialog 
                visible={visible} 
                onDismiss={hideDialog} 
                style={{ backgroundColor: theme.colors.background, borderRadius: 15 }}
            >
                <Dialog.Title style={styles.title}>{state.title}</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.content}>
                        {state.content}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={styles.actionsContainer}>
                    {/* Custom buttons if provided */}
                    {state.buttons && state.buttons.length > 0 ? (
                        state.buttons.map((button, index) => (
                            <Button 
                                key={`button-${index}`}
                                onPress={() => {
                                    hideDialog();
                                    if (button.onPress) button.onPress();
                                }}
                            >
                                {button.text}
                            </Button>
                        ))
                    ) : (
                        // Default OK button if no custom buttons
                        <Button onPress={hideDialog}>Ok</Button>
                    )}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
});