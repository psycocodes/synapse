import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Alert, Animated } from "react-native";
import { Images } from "../constants/";
import { useTheme, Button, Text } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import Constants from 'expo-constants';
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AlertDialog from "../components/AlertDialog";
import ShimmerText from "../components/ShimmerText";

const app_info = `
Version: 1.0.0
Date: 07-03-25
Devs: Mohikshit Ghorai, Pritam Das, Suparno Saha

Made for #TechTrix Software Development 2025 @RCCIIT, Kolkata
`.trim();


export default function WelcomeScreen({ navigation }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    useFonts({
        'Poppins': require('../assets/fonts/Poppins.ttf'),
    });

    const alertDialog = useRef({ createDialog: null });


    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);
    return (
        <>
            <View style={[styles.container, styles.backgroundcontainer]}>
                <Image
                    style={styles.wordcloud}
                    source={Images.wordcloud}
                    resizeMode="cover"
                />
                <Image
                    style={styles.noisyBackgroundFilter}
                    source={Images.noisyBackground}
                    resizeMode="contain"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.gradientVignette}
                />

                <View style={styles.bottomContainer}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                            style={styles.logo}
                            source={Images.logo128}
                            resizeMode="stretch"
                        />
                        <ShimmerText
                            style={{ height: 42, width: 140 }}
                            text="Synapse"
                            textStyle={styles.titleText}
                            textColor={theme.colors.secondary}
                            shimmerColor={theme.colors.secondarySaturated}
                            shimmerDuration={3000} />
                    </View>

                    <LinearGradient
                        start={{ x: 0, y: 0.5 }} end={{ x: 0.9, y: 0.5 }}
                        colors={[theme.colors.secondaryDark, theme.colors.background]}
                        style={styles.button}
                    >
                        <Button
                            icon="chevron-right"
                            mode="text"
                            style={{ width: '100%' }}
                            labelStyle={{ paddingVertical: 6 }}
                            textColor={theme.colors.secondary}
                            onPress={() => navigation.navigate("Home")}>
                            Continue to Dashboard
                        </Button>
                    </LinearGradient>
                    <View style={styles.extraButtonContainer}>
                        <Button
                            mode="text"
                            textColor={theme.colors.secondary}
                            labelStyle={{ textDecorationLine: 'underline' }}
                            onPress={() => alertDialog.current.createDialog('App Info', app_info)}>
                            App Info</Button>
                    </View>

                </View>
                <AlertDialog ref={alertDialog} />
                <StatusBar style="light" />
            </View>
        </>
    );
}

const createStyles = theme => StyleSheet.create({
    gradientVignette: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    logo: {
        height: 30,
        width: 30,
        tintColor: theme.colors.secondary,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight + 24,
        paddingBottom: 24,
    },
    backgroundcontainer: {
        position: 'absolute',
        backgroundColor: theme.colors.secondarySaturated,
        height: '100%',
        width: '100%',
    },
    image: {
        borderWidth: 1,
        flexShrink: 1,
        maxWidth: '65%',
    },

    wordcloud: {
        position: 'absolute',
        resizeMode: 'stretch',
        top: -200,
        left: -200,
        tintColor: '#000000',
    },
    noisyBackgroundFilter: {
        position: 'absolute',
        opacity: 0.4,
        transform:[{scale:0.333}, {translateX:0}, {translateY:-2412}],
        resizeMode: 'stretch',
    },

    bottomContainer: {
        height: '100%',
        width: '100%',
        paddingHorizontal: 24,
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'absolute',
        bottom: "-55%",
    },

    titleText: {
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        fontSize: 30,
    },

    extraButtonContainer: {
        flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', gap: 10, marginBottom: 10
    },

    button: {
        borderRadius: 20,
        alignSelf: 'stretch',
    }
});