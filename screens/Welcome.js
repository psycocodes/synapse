import React, { useEffect } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { useTheme, Button, Text, IconButton } from "react-native-paper";

const app_info = `
info about app
`.trim();

export default function WelcomeScreen({ navigation }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<IconButton
                icon="information-outline"
                onPress={() => Alert.alert('App Info', app_info)}
                iconColor={theme.colors.onPrimaryContainer}
            />)
        });
    }, []);
    return (
        <View style={styles.container}>
            
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>
                    Welcome, <Text style={styles.boldText}>Student</Text>
                </Text>
            </View>

            <Button
                icon="chevron-right"
                mode="outlined"
                style={styles.button}
                onPress={() => navigation.navigate("Home")}>
                Continue to Dashboard
            </Button>

            <Text style={styles.infoText}>
                Some extra info about app
            </Text>
        </View>
    );
}


const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        backgroundColor: theme.colors.background,
    },
    animatedImage: {
        height: 100,
        width: 100,
        marginLeft: 10,
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    welcomeText: {
        fontSize: 18,
        color: "white",
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    boldText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        marginHorizontal: 16,
        marginBottom: 16,
    },

    infoText: {
        borderTopWidth: 1,
        borderColor: theme.colors.tertiary,
        paddingTop: 15,
        marginTop: 15,
        color: theme.colors.tertiary,
        paddingHorizontal: 16,
    }
});