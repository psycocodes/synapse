import { BackHandler, Image, StyleSheet, Text, View} from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import { IconButton, useTheme } from "react-native-paper";
import AddNewDialog from "../components/AddNewDialog";
import ItemType from "../constants/ItemType";
import EmptyContent from '../components/HomeEmptyContent';
import FilledContent from '../components/HomeFilledContent';
import useNotebookData from '../hooks/useNotebookData';
import { 
  ROOT_PATH, 
  getPreviousPath, 
  getGroupPath, 
  getNotebookPath 
} from '../utils/storageUtils';
import LinearGradient from "react-native-linear-gradient";
import { Images } from "../constants";

// const COLOR_0_bgGradient = 'rgb(71, 10, 125)';
const COLOR_0_bgGradient = 'rgb(119, 17, 209)';

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [currentPath, setCurrentPath] = useState(ROOT_PATH);
    const { items, loadList, addItem, clearStorage } = useNotebookData();

    const myDialog = useRef({ createDialog: null });

    useEffect(() => {
        loadList(currentPath);

        const goBack = () => {
            if (currentPath === ROOT_PATH) return false;  // If at root, can't go back
            setCurrentPath(getPreviousPath(currentPath)); // If empty, go back to root
            return true;
        };

        navigation.setOptions({
            headerLeft: () => <IconButton
                icon='arrow-left'
                onPress={() => { if (!goBack()) navigation.goBack() }}
                iconColor={theme.colors.onPrimaryContainer}
            />,
            headerRight: () => <IconButton
                icon="delete-forever"
                onPress={() => clearStorage(setCurrentPath)}
                iconColor={theme.colors.onPrimaryContainer}
            />
        });
        const backHandler = BackHandler.addEventListener("hardwareBackPress", goBack);
        return () => backHandler.remove(); // Cleanup on unmount
    }, [currentPath, navigation, clearStorage, theme]);


    const onItemPress = (item) => {
        if (item.type === ItemType.NOTEBOOK)
            navigation.navigate('Notebook', {
                path: getNotebookPath(currentPath, item.name)
            });
        else
            setCurrentPath(getGroupPath(currentPath, item.name));
    }


    const openDialog = withType => myDialog.current.createDialog(withType);

    const handleAddItem = (name, type) => {
        addItem(name, type, currentPath);
    };

    return (<LinearGradient
        colors={[COLOR_0_bgGradient, 'black']}
        start={{ x: 0.5, y: 0.0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={styles.container}
    >
        <Image
            style={styles.noisyBackgroundFilter}
            source={Images.noisyBackground}
            resizeMode="contain"
        />
        <Text style={styles.breadcrumbs}> {currentPath} </Text>

        {items.length === 0 ? (
            <EmptyContent openDialog={myDialog.current.createDialog} />
        ) : (
            <FilledContent items={items} onItemPress={onItemPress} openDialog={openDialog} />
        )}
        <AddNewDialog ref={myDialog} onDone={handleAddItem} />
    </LinearGradient>);
};

export default HomeScreen;

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,
    },
    breadcrumbs: {
        color: theme.colors.secondary,
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: theme.colors.surface,
    },
    
    noisyBackgroundFilter: {
        position: 'absolute',
        opacity: 0.4,
        // transform:[{scale:0.333}, {translateX:-1080}, {translateY:-2412}],
        transform:[{scale:0.4}, {translateX:-850}, {translateY:-1800}],
        resizeMode: 'stretch',
    },
});