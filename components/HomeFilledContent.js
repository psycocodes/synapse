import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, Pressable } from 'react-native';
import { FAB, IconButton, useTheme } from 'react-native-paper';
import ItemType from "../constants/ItemType";
import LinearGradient from 'react-native-linear-gradient';
import tinycolor from 'tinycolor2';

const COLOR_3_btnGradB = 'rgb(28, 4, 50)'; // 0.4*Color2 | prev: 'rgb(27, 0, 43)';

const ShiningListItem = ({ children, style, innerStyle, onPress }) => {
    const shimmerAnim = React.useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        shimmerAnim.setValue(0);
        Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (onPress) onPress();
        });
    };

    const shimmerTranslateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 300],
    });
    const shimmerOpacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 0.8, 1],
        outputRange: [1, 1, 0.7, 0],
    });
    const mainOpacity = shimmerAnim.interpolate({
        inputRange: [0, 0.1, 0.5, 1],
        outputRange: [1, 0.5, 0.7, 1],
    });

    return (
        <Animated.View style={[style, { overflow: 'hidden', opacity: mainOpacity }]}>
            <Pressable onPressIn={handlePress} style={innerStyle} unstable_pressDelay={100}>
                {children}
            </Pressable>

            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 200,
                    transform: [{ translateX: shimmerTranslateX }],
                    opacity: shimmerOpacity,
                }}
            >
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </Animated.View>
    );
};

export default function ({ items, onItemPress, openDialog }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const renderItem = ({ item }) => (
        <ShiningListItem
            style={styles.itemContainer}
            onPress={() => onItemPress(item)}
            innerStyle={styles.touchableContainer}
        >
            <IconButton
                icon={item.type === ItemType.NOTEBOOK ? 'note-text' : 'folder-open'}
                iconColor={
                    item.type === ItemType.NOTEBOOK
                        ? theme.colors.primaryContainer
                        : theme.colors.tertiaryContainer
                }
                size={30}
            />
            <Text style={styles.itemText} numberOfLines={2}>
                {item.name}
            </Text>
        </ShiningListItem>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => openDialog(null)}
            />
        </View>
    );
}

export const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
    },
    itemContainer: {
        marginBottom: 12,
        marginTop: 8,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: theme.colors.onPrimary,
        backgroundColor: tinycolor(theme.colors.onPrimary).setAlpha(0.3).toString()
    },
    touchableContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    itemText: {
        color: theme.colors.primary,
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
