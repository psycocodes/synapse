import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { Text } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default ShimmerText = ({style, maskElementStyle, textStyle, text, textColor, shimmerColor, shimmerDuration, }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Reset the value and start looping the animation when the component mounts.
        shimmerAnim.setValue(0);
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: shimmerDuration,
                useNativeDriver: true,
            })
        ).start();
    }, []);


    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 30],
    });

    return (
        <MaskedView
            style={[{flexDirection: 'row'}, style]}
            maskElement={
                <View
                    style={[{
                        // Transparent background because mask is based off alpha channel.
                        backgroundColor: 'transparent',
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                    }, maskElementStyle]}
                >
                    <Text style={textStyle}> {text} </Text>
                </View>
            }
        >
            <View style={{ backgroundColor: textColor, position: 'absolute', width: '100%', height: '100%' }} />
            <Animated.View
                style={{
                    position: 'absolute',
                    width: '100%', // width of the shimmering overlay; adjust as needed
                    height: '100%',
                    transform: [{ translateX }],
                }}
            >
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', shimmerColor, 'rgba(255, 255, 255, 0)']}
                    locations={[0.35, 0.5, 0.65]}
                    start={{ x: 0, y: 0.3 }}
                    end={{ x: 1, y: 0.7 }}
                    style={{ position: 'absolute', width: '100%', height: '100%', }} />
            </Animated.View>
        </MaskedView>
    );
};