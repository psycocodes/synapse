// hooks/useNotebookData.js
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyForSubGroups, keyForNotebooks, createItem, namesOfItemsOfType, NOTEBOOK_SUFFIX, ROOT_PATH } from '../utils/storageUtils';
import { Alert } from 'react-native';
import ItemType from '../constants/ItemType';

export default function useNotebookData() {
    const [items, setItems] = useState([]);

    const loadList = useCallback(async (path) => {
        try {
            const [storedGroups, storedNotebooks] = await Promise.all([
                AsyncStorage.getItem(keyForSubGroups(path)),
                AsyncStorage.getItem(keyForNotebooks(path))
            ]);

            const groups = storedGroups ? JSON.parse(storedGroups) : [];
            const notebooks = storedNotebooks ? JSON.parse(storedNotebooks) : [];

            const list = [
                ...groups.map((group) => createItem(group, ItemType.GROUP)),
                ...notebooks.map((nb) => createItem(nb, ItemType.NOTEBOOK))
            ];

            setItems(list);
        } catch (e) {
            console.error('Failed to load data', e);
        }
    }, []);

    const addItem = useCallback(
        async (name, type, currentPath) => {
            const trimmedName = name.trim();
            if (!trimmedName) {
                Alert.alert('Error', `${type} name cannot be empty`);
                return;
            }
            if (trimmedName === NOTEBOOK_SUFFIX) {
                Alert.alert('Error', `${type} name cannot be ${NOTEBOOK_SUFFIX}`);
                return;
            }

            try {
                const storageKey =
                    type === ItemType.NOTEBOOK
                        ? keyForNotebooks(currentPath)
                        : keyForSubGroups(currentPath);
                const existingItemNamesOfType = namesOfItemsOfType(items, type);

                if (existingItemNamesOfType.includes(trimmedName)) {
                    Alert.alert('Error', `${type} with same name already exists!`);
                    return;
                }

                await AsyncStorage.setItem(storageKey, JSON.stringify([...existingItemNamesOfType, trimmedName]));
                setItems((prev) => [...prev, createItem(trimmedName, type)]);
            } catch (e) {
                console.error(`Failed to create ${type}`, e);
                Alert.alert('Error', `Error while creating ${type}`);
            }
        },
        [items]
    );

    const clearStorage = useCallback(async (setCurrentPath) => {
        try {
            await AsyncStorage.clear();
            setCurrentPath(ROOT_PATH);
            setItems([]);
            console.log('Storage cleared successfully');
        } catch (e) {
            console.error('Failed to clear storage', e);
        }
    }, []);

    return { items, loadList, addItem, clearStorage };
}
