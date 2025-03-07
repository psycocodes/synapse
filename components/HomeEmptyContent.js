// components/EmptyContent.js
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Images } from '../constants/';
import ItemType from '../constants/ItemType';

export default function ({ openDialog }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
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
                        onPress={() => openDialog(ItemType.NOTEBOOK)}
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
                        onPress={() => openDialog(ItemType.GROUP)}
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
        </View>
    );
};


const createStyles = (theme) => StyleSheet.create({
    image: {
        height: 200,
        width: '100%',
    },
    instructionText: {
        color: theme.colors.secondary,
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
        borderColor: theme.colors.primary,
    },
    icon: {
        height: 48,
        width: 48,
    },
    buttonText: {
        textAlign: 'center',
        color: theme.colors.primary,
    },
});
