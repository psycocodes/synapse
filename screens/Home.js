import { Alert, BackHandler, FlatList, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Images } from "../constants/";
import { TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB, IconButton, useTheme } from "react-native-paper";
import AddNewDialog from "../components/AddNewDialog";


const EmptyContent = ({ onAdd }) => {
    const theme = useTheme();
    const styles = createEmptyContentStyles(theme);
    const dialog = useRef(null);
    return <View>
        <Image
            style={styles.image}
            source={Images.noFiles}
            resizeMode="contain"
            tintColor={theme.colors.secondary}
        />
        <Text style={styles.instructionText}>
            Click on the buttons to Add a NoteBook or a Group.
        </Text>
        <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    onPress={() => {
                        dialog.current.showDialog();
                        dialog.current.create(TYPE_NOTEBOOK);
                    }}
                    activeOpacity={0.7}
                    style={styles.button}
                >
                    <Image
                        style={styles.icon}
                        source={Images.notebookCreate}
                        resizeMode="contain"
                        tintColor={theme.colors.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Add Notebook</Text>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    onPress={() => {
                        dialog.current.showDialog();
                        dialog.current.create(TYPE_GROUP);
                    }}
                    activeOpacity={0.7}
                    style={styles.button}
                >
                    <Image
                        style={styles.icon}
                        source={Images.groupCreate}
                        resizeMode="contain"
                        tintColor={theme.colors.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.buttonText}>Add Group</Text>
            </View>
        </View>
        <AddNewDialog ref={dialog} onDone={onAdd} />
    </View>;
}


const FilledContent = ({ items, onItemPress, onAdd }) => {
    // console.log('filled content updated with items: ', items);
    const dialog = useRef(null);
    const theme = useTheme();
    const styles = createFilledContentStyles(theme);
    return <View style={styles.container}>
        <FlatList
            data={items}
            renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                    <TouchableOpacity
                        onPress={() => onItemPress(item)}
                        activeOpacity={0.7}
                        style={styles.touchableContainer}
                    >
                        <IconButton
                            icon={item.type === "notebook" ? "notebook-outline" : "folder-outline"}
                            iconColor={item.type === "notebook" ? theme.colors.primaryContainer : theme.colors.tertiaryContainer}
                            size={30}
                        />
                        <Text style={styles.itemText}
                            numberOfLines={2}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                    <IconButton icon="play" iconColor={theme.colors.onBackground} size={30} />
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
        <FAB
            style={styles.fab}
            icon="plus"
            label="Add"
            onPress={() => dialog.current.showDialog()}
        />
        <AddNewDialog ref={dialog} onDone={onAdd} />
    </View>;
}

const ROOT_PATH = '/root/';
const TYPE_NOTEBOOK = 'notebook';
const TYPE_GROUP = 'group';

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [currentPath, setCurrentPath] = useState(ROOT_PATH);  // Start at root
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadList(currentPath);

        const goBack = () => {
            if (currentPath === ROOT_PATH) return false;  // If at root, can't go back

            const paths = currentPath.split('/').filter(Boolean);
            paths.pop(); // Remove the last group
            setCurrentPath(paths.length ? `/${paths.join('/')}/` : ROOT_PATH); // If empty, go back to root
            return true;
        };

        navigation.setOptions({
            headerLeft: () => (<IconButton
                icon='arrow-left'
                onPress={() => { if (!goBack()) navigation.goBack() }}
                iconColor={theme.colors.onPrimaryContainer}
            />),
            headerRight: () => (<IconButton
                icon="delete-forever"
                onPress={clearStorage}
                iconColor={theme.colors.onPrimaryContainer}
            />)
        });
        const backHandler = BackHandler.addEventListener("hardwareBackPress", goBack);
        return () => backHandler.remove(); // Cleanup on unmount
    }, [navigation, currentPath]);

    const loadList = async (path) => {
        try {
            const storedGroups = await AsyncStorage.getItem(path);
            const storedNotebooks = await AsyncStorage.getItem(`${path}_notebooks`); // Use a different key for notebooks
            // group name cant be '_notebooks'
            const groups = storedGroups ? JSON.parse(storedGroups) : [];
            const notebooks = storedNotebooks ? JSON.parse(storedNotebooks) : [];

            const items = [];
            for (let i = 0; i < groups.length; i++) {
                items.push({ 'name': groups[i], 'type': TYPE_GROUP })
            }
            for (let i = 0; i < notebooks.length; i++) {
                items.push({ 'name': notebooks[i], 'type': TYPE_NOTEBOOK })
            }
            setItems(items);
        } catch (e) {
            console.error('Failed to load data', e);
        }
    };

    // console.log('rendering at: ' + currentPath);

    const addItem = async (name, type) => {
        // Validity checks
        name = name.trim();
        const isNotebook = type === TYPE_NOTEBOOK;
        const typeN = isNotebook ? 'Notebook' : 'Group';
        console.log(`to add ${typeN} named '${name}' at path: ${currentPath}`);

        if (!name) {
            Alert.alert('Error', typeN + ' name cannot be empty');
            return;
        }

        try {
            const storageKey = currentPath + (isNotebook ? '_notebooks' : '');
            const mItems = items.filter(x => x.type === type).map(x => x.name);

            if (mItems.includes(name)) {
                Alert.alert('Error', typeN + ' already exists!');
                return;
            }

            await AsyncStorage.setItem(storageKey, JSON.stringify([...mItems, name]));
            setItems([...items, { name: name, type: type }]);

        } catch (e) {
            console.error('Failed to create ' + typeN, e);
            Alert.alert('Error', 'Error while creating ' + typeN);
        }
    };

    const onItemPress = (item) => {
        if (item.type === TYPE_NOTEBOOK) {
            openNotebook(item.name);
        } else {
            openGroup(item.name);
        }
    }

    // Open a group (navigate into it)
    const openGroup = (groupName) => {
        setCurrentPath(`${currentPath}${groupName}/`);
    };

    const openNotebook = (notebookName) => {
        console.log('open notebook: ' + notebookName);
        // router.push({ pathname: 'notebook', params: { path: `${currentPath}$_notebooks/${notebookName}` } });
        navigation.navigate('Notebook', {
            path: `${currentPath}$_notebooks/${notebookName}`
        });
    };
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear(); // Clears AsyncStorage
            setCurrentPath(ROOT_PATH);
            setItems([]);  // Reset state to an empty array
            console.log('Storage cleared successfully');
        } catch (e) {
            console.error('Failed to clear storage', e);
        }
    };

    return (
        <View style={styles.container}>
            <Text id="breadcrums" style={styles.breadcrumbs}>
                {currentPath}
            </Text>

            {items.length === 0 ? (
                <EmptyContent onAdd={addItem} />
            ) : (
                <FilledContent items={items} onItemPress={onItemPress} onAdd={addItem} />
            )}
        </View>
    );
};

export default HomeScreen;

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,  // Use your primary color hex code or name here
    },
    breadcrumbs: {
        color: theme.colors.secondary, // gray-500
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: theme.colors.onPrimary,
    },
    ec_image: {
        height: 200,
        width: '100%',
    },
    ec_instructionText: {
        color: theme.colors.secondary, // gray-100
        // fontFamily: 'Plight', // Assuming font-plight is mapped to 'Plight'
        fontSize: 12,
        paddingHorizontal: 10,
        textAlign: 'center',
        marginBottom: 16,
    },
    ec_buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        gap: 26,
    },
    ec_buttonWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        marginTop: 16,
    },
    ec_button: {
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary, // gray-100
    },
    ec_icon: {
        height: 48,
        width: 48,
    },
    ec_buttonText: {
        textAlign: 'center',
        color: theme.colors.primary, // gray-100
    },
});

const createEmptyContentStyles = theme => StyleSheet.create({
    image: {
        height: 200,
        width: '100%',
    },
    instructionText: {
        color: theme.colors.secondary, // gray-100
        // fontFamily: 'Plight', // Assuming font-plight is mapped to 'Plight'
        fontSize: 12,
        paddingHorizontal: 10,
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        gap: 26,
    },
    buttonWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        marginTop: 16,
    },
    button: {
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary, // gray-100
    },
    icon: {
        height: 48,
        width: 48,
    },
    buttonText: {
        textAlign: 'center',
        color: theme.colors.primary, // gray-100
    },
});


const createFilledContentStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        marginBottom: 12,
        marginTop: 8,
        marginHorizontal: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 8,
        paddingRight: 16,
        borderWidth: 1,
        borderColor: theme.colors.primary, // gray-100
    },
    touchableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginRight: 24,
    },
    itemText: {
        color: theme.colors.onBackground,
        // fontFamily: 'Pmedium', // Assuming 'font-pmedium' maps to 'Pmedium'
        fontSize: 14,
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
}); 