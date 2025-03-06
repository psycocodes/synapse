import { useSpeechRecognitionEvent } from "expo-speech-recognition";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    withSpring,
    withSequence,
} from "react-native-reanimated";

const MIN_SCALE = 1;
const MAX_SCALE = 2;

export default function VolumeMeter({ style }) {
    const theme = useTheme();
    const styles = createStyles(theme, style?.indicatorSize || 30, style?.indicatorPadding || 20);

    const volumeScale = useSharedValue(MIN_SCALE);
    const pulseScale = useSharedValue(MIN_SCALE);
    const pulseOpacity = useSharedValue(0);

    const reset = () => {
        volumeScale.value = MIN_SCALE;
        pulseScale.value = MIN_SCALE;
        pulseOpacity.value = 0;
    };

    useSpeechRecognitionEvent("start", reset);
    useSpeechRecognitionEvent("end", reset);

    useSpeechRecognitionEvent("volumechange", (event) => {
        // Don't animate anything if the volume is too low
        if (event.value <= 1) {
            return;
        }

        const newScale = interpolate(
            event.value,
            [-2, 10], // The value range is between -2 and 10
            [MIN_SCALE, MAX_SCALE],
            Extrapolation.CLAMP,
        );

        // Animate the volume scaling
        volumeScale.value = withSequence(
            withSpring(newScale, {
                damping: 10,
                stiffness: 150,
            }),
            // Scale back down, unless the volume changes again
            withTiming(MIN_SCALE, { duration: 500 }),
        );

        // Animate the pulse (scale and fade out)
        if (pulseOpacity.value <= 0) {
            pulseScale.value = MIN_SCALE;
            pulseOpacity.value = 1;
            pulseScale.value = withTiming(MAX_SCALE, {
                duration: 1000,
                easing: Easing.out(Easing.quad),
            });
            pulseOpacity.value = withTiming(0, { duration: 1000 });
        }
    });

    const volumeScaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: volumeScale.value }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
        transform: [{ scale: pulseScale.value }],
    }));

    return (
        <View style={[styles.container, style]}>
            <View style={styles.absoluteCenteredContainer}>
                <Animated.View style={[styles.circularBorder, volumeScaleStyle]} />
            </View>
            <View style={styles.absoluteCenteredContainer}>
                <Animated.View style={[styles.pulse, pulseStyle]} />
            </View>
            <View style={[styles.centered]}>
            </View>
        </View>
    );
}

const createStyles = (theme, indicatorSize, indicatorPadding) => StyleSheet.create({
    container: {
        position: "relative",
        marginVertical: 20,
        paddingVertical: indicatorPadding,
    },
    absoluteCenteredContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    pulse: {
        borderWidth: 1,
        borderColor: theme.colors.onPrimaryContainer,
        width: indicatorSize,
        height: indicatorSize,
        borderRadius: indicatorSize,
    },
    circularBorder: {
        backgroundColor: theme.colors.primary,
        width: indicatorSize,
        height: indicatorSize,
        borderRadius: indicatorSize,
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: indicatorSize,
        height: indicatorSize,
        borderRadius: indicatorSize,
        overflow: "hidden",
    },
});