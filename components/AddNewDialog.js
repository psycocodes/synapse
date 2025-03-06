import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, withTheme } from 'react-native-paper';


const createStyles = (theme) => StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        marginBottom: 24
    },
    button: {
        alignItems: 'flex-start',
        paddingHorizontal: 32,
    },
    input: {
        backgroundColor: 'transparent'
    },
    foundText: {
        color: theme.colors.primary,
        padding: 4,
    }
});

const TYPE_NOTEBOOK = 'notebook';
const TYPE_GROUP = 'group';

class AddNewDialog extends React.Component {
    constructor(props) {
        super(props);
        const { theme, onDone } = props; // Access the theme from props
        this.styles = createStyles(theme);
        this.onDone = onDone;
        this.onDone = this.onDone.bind(this);
        this.state = {
            visible: false,
            page: 0,
            name: '',
            type: '',
        };
        this.showDialog = this.showDialog.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.create = this.create.bind(this);

    }
    showDialog() {
        this.setState({ visible: true });
    }
    hideDialog() {
        this.setState({
            visible: false,
            page: 0,
            name: '',
        });
    }
    onTextChanged(text) {
        this.setState({ name: text });
    }
    create(type) {
        this.setState({ page: 1, type: type });
    }

    render() {
        return (
            <Portal>
                <Dialog visible={this.state.visible} onDismiss={this.hideDialog}>
                    <Dialog.Title>{'Add New ' + this.state.type}</Dialog.Title>
                    {this.state.page == 0 &&
                        (<View style={this.styles.buttonsContainer}>
                            <Button
                                style={this.styles.button}
                                icon="folder-open"
                                onPress={() => { this.create(TYPE_GROUP) }}>Create Group</Button>
                            <Button
                                style={this.styles.button}
                                icon="note-text"
                                onPress={() => { this.create(TYPE_NOTEBOOK) }}>Create Notebook</Button>
                        </View>)
                    }
                    {this.state.page == 1 &&
                        (<Dialog.Content>
                            <TextInput
                                style={this.styles.input}
                                mode={'outlined'}
                                label="Enter name"
                                value={this.state.name}
                                onChangeText={this.onTextChanged}

                            />
                            {/* {this.state.usernameFound &&
                                <Text style={this.styles.foundText}>User found!</Text>
                            } */}
                        </Dialog.Content>)
                    }
                    {this.state.page == 1 &&
                        (<Dialog.Actions>
                            <Button onPress={() => {
                                this.onDone(this.state.name, this.state.type);
                                this.hideDialog();
                            }}>Ok</Button>
                            <Button onPress={this.hideDialog}>Cancel</Button>
                        </Dialog.Actions>)
                    }
                </Dialog>
            </Portal>
        );
    }
}

export default withTheme(AddNewDialog);