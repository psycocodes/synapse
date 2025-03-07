import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text, useTheme } from 'react-native-paper'

const UploadDocumentScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sorry for the inconvenience! This page is under development.</Text>
        </View>
    )
}

export default UploadDocumentScreen

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 8,
    },
    text: {
        marginTop: 16,
        color: theme.colors.secondary,
        textAlign: 'center',
    }
});